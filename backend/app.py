from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import xarray as xr
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import plotly
import json
import os
from scipy import stats
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import requests
import tempfile
from data_processor import OceanDataProcessor

# Custom JSON encoder to handle numpy types
class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, np.bool_):
            return bool(obj)
        return super(NumpyEncoder, self).default(obj)

app = Flask(__name__)
CORS(app)

# Initialize data processor
try:
    data_processor = OceanDataProcessor()
    print("Data processor initialized successfully")
except Exception as e:
    print(f"Error initializing data processor: {e}")
    data_processor = None

# Ocean datasets configuration
DATASETS = {
    "temperature": {
        "url": "https://www.ncei.noaa.gov/data/oceans/woa/WOA18/DATA/temperature/netcdf/decav/1.00/woa18_decav_t00_01.nc",
        "file_name": "woa18_temperature.nc",
        "var_name": "t_an",
        "long_name": "Sea Surface Temperature",
        "unit": "°C",
        "colorscale": "RdYlBu_r",
        "description": "Ocean temperature data from World Ocean Atlas"
    },
    "salinity": {
        "url": "https://www.ncei.noaa.gov/data/oceans/woa/WOA18/DATA/salinity/netcdf/decav/1.00/woa18_decav_s00_01.nc",
        "file_name": "woa18_salinity.nc",
        "var_name": "s_an",
        "long_name": "Sea Surface Salinity",
        "unit": "PSU",
        "colorscale": "Viridis",
        "description": "Ocean salinity data from World Ocean Atlas"
    },
    "oxygen": {
        "url": "https://www.ncei.noaa.gov/data/oceans/woa/WOA18/DATA/oxygen/netcdf/all/1.00/woa18_all_o00_01.nc",
        "file_name": "woa18_oxygen.nc",
        "var_name": "o_an",
        "long_name": "Dissolved Oxygen",
        "unit": "ml/l",
        "colorscale": "plasma",
        "description": "Dissolved oxygen concentration data from World Ocean Atlas"
    }
}

@app.route('/api/ocean-data/<layer>')
def get_ocean_data(layer):
    """Get ocean condition data for a specific layer"""
    try:
        if not data_processor:
            return jsonify({"error": "Data processor not initialized"}), 500
            
        if layer not in DATASETS:
            return jsonify({
                "error": "Invalid layer", 
                "available_layers": list(DATASETS.keys())
            }), 400
        
        # Focus on Indian Ocean region
        data = data_processor.get_ocean_layer_data(
            layer, 
            lat_range=(5, 25), 
            lon_range=(65, 97)
        )
        
        if data is None:
            return jsonify({"error": f"Failed to load {layer} data"}), 500
        
        return jsonify({
            "data": data,
            "metadata": DATASETS[layer],
            "region": "Indian Ocean (5°N-25°N, 65°E-97°E)"
        })
        
    except Exception as e:
        print(f"Error in get_ocean_data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/biodiversity-data')
def get_biodiversity_data():
    """Get biodiversity data"""
    try:
        if not data_processor:
            return jsonify({"error": "Data processor not initialized"}), 500
            
        data = data_processor.get_biodiversity_data()
        
        if not data or not data.get('points'):
            return jsonify({
                "error": "No biodiversity data available",
                "message": "Please ensure biodiversity.csv file is present and contains valid data"
            }), 404
        
        return jsonify({
            "data": data,
            "summary": {
                "total_points": len(data['points']),
                "unique_species": len(data['unique_species']),
                "coordinate_range": {
                    "lat_min": min(data['lat']) if data['lat'] else None,
                    "lat_max": max(data['lat']) if data['lat'] else None,
                    "lon_min": min(data['lon']) if data['lon'] else None,
                    "lon_max": max(data['lon']) if data['lon'] else None
                }
            }
        })
        
    except Exception as e:
        print(f"Error in get_biodiversity_data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/map-visualization')
def get_map_visualization():
    """Get complete map visualization with ocean layers and biodiversity points"""
    try:
        if not data_processor:
            return jsonify({"error": "Data processor not initialized"}), 500
        
        print("Loading biodiversity data...")
        biodiversity_data = data_processor.get_biodiversity_data()
        
        print("Loading ocean layers...")
        ocean_layers = {}
        for layer in DATASETS.keys():
            print(f"Processing {layer} layer...")
            layer_data = data_processor.get_ocean_layer_data(
                layer, lat_range=(5, 25), lon_range=(65, 97)
            )
            if layer_data:
                ocean_layers[layer] = layer_data
                print(f"{layer} layer loaded successfully")
            else:
                print(f"Warning: {layer} layer failed to load")
        
        print("Creating map visualization...")
        fig = data_processor.create_map_visualization(ocean_layers, biodiversity_data)
        
        if fig is None:
            return jsonify({"error": "Failed to create map visualization"}), 500
        
        # Convert plotly figure to JSON
        plot_json = json.loads(plotly.io.to_json(fig))
        
        response_data = {
            "plot": plot_json,
            "metadata": {
                "biodiversity_count": len(biodiversity_data.get('points', [])),
                "species_count": len(biodiversity_data.get('unique_species', [])),
                "ocean_layers": list(ocean_layers.keys()),
                "failed_layers": [layer for layer in DATASETS.keys() if layer not in ocean_layers],
                "region": "Indian Ocean Political Map",
                "coordinate_bounds": {
                    "lat_range": [5, 25],
                    "lon_range": [65, 97]
                }
            }
        }
        
        print("Map visualization created successfully")
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in get_map_visualization: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/correlations')
def get_correlations():
    """Get correlation analysis between ocean conditions and species abundance"""
    try:
        if not data_processor:
            return jsonify({"error": "Data processor not initialized"}), 500
        
        # Get biodiversity data
        biodiversity_data = data_processor.get_biodiversity_data()
        
        if not biodiversity_data.get('points'):
            return jsonify({
                "error": "No biodiversity data available for correlation analysis"
            }), 404
        
        # Get ocean data
        ocean_layers = {}
        for layer in DATASETS.keys():
            layer_data = data_processor.get_ocean_layer_data(
                layer, lat_range=(5, 25), lon_range=(65, 97)
            )
            if layer_data:
                ocean_layers[layer] = layer_data
        
        if not ocean_layers:
            return jsonify({
                "error": "No ocean data available for correlation analysis"
            }), 500
        
        # Perform correlation analysis
        correlations = data_processor.analyze_correlations(biodiversity_data, ocean_layers)
        
        return jsonify({
            "correlations": correlations,
            "metadata": {
                "analysis_type": "Pearson correlation",
                "ocean_variables": list(ocean_layers.keys()),
                "species_analyzed": len(correlations),
                "significance_level": 0.05
            }
        })
        
    except Exception as e:
        print(f"Error in get_correlations: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/species-analysis/<species>')
def get_species_analysis(species):
    """Get detailed analysis for a specific species"""
    try:
        if not data_processor:
            return jsonify({"error": "Data processor not initialized"}), 500
        
        # Get biodiversity data
        biodiversity_data = data_processor.get_biodiversity_data()
        
        # Get ocean data
        ocean_layers = {}
        for layer in DATASETS.keys():
            layer_data = data_processor.get_ocean_layer_data(
                layer, lat_range=(5, 25), lon_range=(65, 97)
            )
            if layer_data:
                ocean_layers[layer] = layer_data
        
        # Perform species-specific analysis
        analysis = data_processor.get_species_analysis(species, biodiversity_data, ocean_layers)
        
        return jsonify({
            "analysis": analysis,
            "metadata": {
                "species": species,
                "analysis_date": "2024",
                "ocean_variables": list(ocean_layers.keys())
            }
        })
        
    except Exception as e:
        print(f"Error in get_species_analysis: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/region-stats')
def get_region_stats():
    """Get statistical summary of the Indian Ocean region"""
    try:
        if not data_processor:
            return jsonify({"error": "Data processor not initialized"}), 500
        
        # Get biodiversity data
        biodiversity_data = data_processor.get_biodiversity_data()
        
        # Get ocean data
        ocean_layers = {}
        for layer in DATASETS.keys():
            layer_data = data_processor.get_ocean_layer_data(
                layer, lat_range=(5, 25), lon_range=(65, 97)
            )
            if layer_data:
                ocean_layers[layer] = layer_data
        
        # Get regional statistics
        stats = data_processor.get_region_statistics(biodiversity_data, ocean_layers)
        
        return jsonify(stats)
        
    except Exception as e:
        print(f"Error in get_region_stats: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/cross-domain-analysis')
def get_cross_domain_analysis():
    """Get comprehensive cross-domain analysis visualizations"""
    try:
        if not data_processor:
            return jsonify({"error": "Data processor not initialized"}), 500
        
        print("Loading data for cross-domain analysis...")
        
        # Get biodiversity data
        biodiversity_data = data_processor.get_biodiversity_data()
        
        if not biodiversity_data.get('points'):
            return jsonify({
                "error": "No biodiversity data available for cross-domain analysis"
            }), 404
        
        # Get ocean data
        ocean_layers = {}
        for layer in DATASETS.keys():
            layer_data = data_processor.get_ocean_layer_data(
                layer, lat_range=(5, 25), lon_range=(65, 97)
            )
            if layer_data:
                ocean_layers[layer] = layer_data
        
        if not ocean_layers:
            return jsonify({
                "error": "No ocean data available for cross-domain analysis"
            }), 500
        
        print("Creating cross-domain analysis visualizations...")
        
        # Create comprehensive cross-domain analysis
        visualizations = data_processor.create_cross_domain_analysis(biodiversity_data, ocean_layers)
        
        return jsonify({
            "visualizations": visualizations,
            "metadata": {
                "analysis_type": "Cross-Domain Ocean-Biodiversity Analysis",
                "biodiversity_species": len(biodiversity_data.get('unique_species', [])),
                "biodiversity_points": len(biodiversity_data.get('points', [])),
                "ocean_variables": list(ocean_layers.keys()),
                "region": "Indian Ocean (5°N-25°N, 65°E-97°E)"
            }
        })
        
    except Exception as e:
        print(f"Error in get_cross_domain_analysis: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/datasets')
def get_available_datasets():
    """Get information about available datasets"""
    return jsonify({
        "ocean_datasets": DATASETS,
        "biodiversity_dataset": {
            "name": "Marine Biodiversity",
            "source": "biodiversity.csv",
            "description": "Species occurrence and abundance data in Indian Ocean waters",
            "required_columns": ["decimalLatitude", "decimalLongitude", "scientificName", "individualCount"]
        }
    })

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    status = {
        "status": "healthy" if data_processor else "degraded",
        "message": "Ocean Analysis API is running",
        "data_processor": "initialized" if data_processor else "failed",
        "available_endpoints": [
            "/api/health",
            "/api/datasets",
            "/api/ocean-data/<layer>",
            "/api/biodiversity-data",
            "/api/map-visualization",
            "/api/correlations",
            "/api/species-analysis/<species>",
            "/api/region-stats"
        ]
    }
    
    if data_processor:
        # Test biodiversity data availability
        try:
            bio_data = data_processor.get_biodiversity_data()
            status["biodiversity_status"] = f"{len(bio_data.get('points', []))} points available"
        except:
            status["biodiversity_status"] = "error loading biodiversity data"
    
    return jsonify(status)

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found", "available_endpoints": [
        "/api/health", "/api/datasets", "/api/ocean-data/<layer>", 
        "/api/biodiversity-data", "/api/map-visualization"
    ]}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("Starting Ocean Analysis API...")
    print(f"Data processor status: {'OK' if data_processor else 'FAILED'}")
    app.run(debug=True, host='0.0.0.0', port=5000)