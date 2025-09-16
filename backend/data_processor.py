import pandas as pd
import numpy as np
import xarray as xr
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import plotly
import requests
import tempfile
import os
from scipy import stats
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import json

class OceanDataProcessor:
    def __init__(self):
        self.biodiversity_data = None
        self.ocean_data_cache = {}
        self.load_biodiversity_data()
    
    def load_biodiversity_data(self):
        """Load and process biodiversity CSV data"""
        try:
            # Check if file exists
            if not os.path.exists("biodiversity.csv"):
                print("Error: biodiversity.csv file not found")
                self.biodiversity_data = pd.DataFrame()
                return
            
            # Load the CSV file
            df = pd.read_csv("biodiversity.csv")
            print(f"Raw CSV loaded: {len(df)} rows")
            
            # Clean and process the data
            df = df.dropna(subset=['decimalLatitude', 'decimalLongitude', 'scientificName'])
            print(f"After removing NaN values: {len(df)} rows")
            
            # Filter for Indian waters (approximate bounds)
            df = df[
                (df['decimalLatitude'] >= 5) & (df['decimalLatitude'] <= 25) &
                (df['decimalLongitude'] >= 65) & (df['decimalLongitude'] <= 95)
            ]
            print(f"After Indian waters filter: {len(df)} rows")
            
            # Group by location and species to get abundance
            grouped = df.groupby(['decimalLatitude', 'decimalLongitude', 'scientificName']).agg({
                'individualCount': 'sum',
                'waterBody': 'first',
                'locality': 'first',
                'habitat': 'first'
            }).reset_index()
            
            # Fill missing individual counts with 1
            grouped['individualCount'] = grouped['individualCount'].fillna(1)
            
            self.biodiversity_data = grouped
            print(f"Successfully loaded {len(grouped)} biodiversity records")
            print(f"Unique species: {grouped['scientificName'].nunique()}")
            
        except Exception as e:
            print(f"Error loading biodiversity data: {e}")
            import traceback
            traceback.print_exc()
            self.biodiversity_data = pd.DataFrame()
    
    def get_biodiversity_data(self):
        """Get processed biodiversity data for visualization"""
        if self.biodiversity_data is None or self.biodiversity_data.empty:
            return {"points": [], "species": [], "abundance": [], "lat": [], "lon": []}
        
        # Get unique species for color mapping
        unique_species = self.biodiversity_data['scientificName'].unique()
        species_color_map = {species: i for i, species in enumerate(unique_species)}
        
        return {
            "points": self.biodiversity_data[['decimalLatitude', 'decimalLongitude']].values.tolist(),
            "species": self.biodiversity_data['scientificName'].tolist(),
            "abundance": self.biodiversity_data['individualCount'].tolist(),
            "lat": self.biodiversity_data['decimalLatitude'].tolist(),
            "lon": self.biodiversity_data['decimalLongitude'].tolist(),
            "waterBody": self.biodiversity_data['waterBody'].tolist(),
            "locality": self.biodiversity_data['locality'].tolist(),
            "habitat": self.biodiversity_data['habitat'].tolist(),
            "species_color_map": species_color_map,
            "unique_species": unique_species.tolist()
        }
    
    def get_ocean_layer_data(self, layer, lat_range=(5, 25), lon_range=(65, 95)):
        """Get ocean layer data for specified region"""
        try:
            # Use cached data if available
            if layer in self.ocean_data_cache:
                return self.ocean_data_cache[layer]
            
            # For demo purposes, create synthetic data
            lats = np.linspace(lat_range[0], lat_range[1], 50)
            lons = np.linspace(lon_range[0], lon_range[1], 50)
            
            # Create synthetic ocean data based on layer type
            if layer == "temperature":
                # Temperature: warmer near equator, cooler in north
                temp_data = 28 - 0.5 * (lats - 5) + np.random.normal(0, 1, (50, 50))
                temp_data = np.clip(temp_data, 20, 32)
                data = temp_data
                unit = "°C"
                colorscale = "RdBu_r"
                
            elif layer == "salinity":
                # Salinity: higher in Arabian Sea, lower in Bay of Bengal
                salinity_data = 35 + 0.1 * (lons - 65) + np.random.normal(0, 0.5, (50, 50))
                salinity_data = np.clip(salinity_data, 32, 38)
                data = salinity_data
                unit = "PSU"
                colorscale = "Blues"
                
            elif layer == "oxygen":
                # Oxygen: higher in surface waters, varies with temperature
                oxygen_data = 5 - 0.1 * (lats - 5) + np.random.normal(0, 0.3, (50, 50))
                oxygen_data = np.clip(oxygen_data, 2, 8)
                data = oxygen_data
                unit = "ml/l"
                colorscale = "Viridis"
            
            # Create meshgrid
            lon_grid, lat_grid = np.meshgrid(lons, lats)
            
            result = {
                "lat": lats.tolist(),
                "lon": lons.tolist(),
                "data": data.tolist(),
                "unit": unit,
                "colorscale": colorscale,
                "lat_grid": lat_grid.tolist(),
                "lon_grid": lon_grid.tolist()
            }
            
            # Cache the result
            self.ocean_data_cache[layer] = result
            return result
            
        except Exception as e:
            print(f"Error processing {layer} data: {e}")
            return None
    
    def create_map_visualization(self, ocean_layers, biodiversity_data):
        """Create interactive map visualization with detailed Indian political map"""
        fig = go.Figure()
        
        # Add detailed Indian political boundaries and geographical features
        
        # 1. Mainland India coastline (detailed)
        mainland_lat = [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0, 24.5, 24.0, 23.5, 23.0, 22.5, 22.0, 21.5, 21.0, 20.5, 20.0, 19.5, 19.0, 18.5, 18.0, 17.5, 17.0, 16.5, 16.0, 15.5, 15.0, 14.5, 14.0, 13.5, 13.0, 12.5, 12.0, 11.5, 11.0, 10.5, 10.0, 9.5, 9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0]
        mainland_lon = [68.0, 68.5, 69.0, 69.5, 70.0, 70.5, 71.0, 71.5, 72.0, 72.5, 73.0, 73.5, 74.0, 74.5, 75.0, 75.5, 76.0, 76.5, 77.0, 77.5, 78.0, 78.5, 79.0, 79.5, 80.0, 80.5, 81.0, 81.5, 82.0, 82.5, 83.0, 83.5, 84.0, 84.5, 85.0, 85.5, 86.0, 86.5, 87.0, 87.5, 88.0, 88.5, 89.0, 89.5, 90.0, 90.5, 91.0, 91.5, 92.0, 92.5, 93.0, 93.5, 94.0, 94.5, 95.0, 95.5, 96.0, 95.5, 95.0, 94.5, 94.0, 93.5, 93.0, 92.5, 92.0, 91.5, 91.0, 90.5, 90.0, 89.5, 89.0, 88.5, 88.0, 87.5, 87.0, 86.5, 86.0, 85.5, 85.0, 84.5, 84.0, 83.5, 83.0, 82.5, 82.0, 81.5, 81.0, 80.5, 80.0, 79.5, 79.0, 78.5, 78.0, 77.5, 77.0, 76.5, 76.0, 75.5, 75.0, 74.5, 74.0, 73.5, 73.0, 72.5, 72.0, 71.5, 71.0, 70.5, 70.0, 69.5, 69.0, 68.5, 68.0]
        
        fig.add_trace(go.Scatter(
            x=mainland_lon,
            y=mainland_lat,
            mode='lines',
            line=dict(color='black', width=3),
            name='Indian Coastline',
            visible=True,
            hovertemplate="<b>Indian Coastline</b><br>" +
                         "Lat: %{y:.2f}<br>" +
                         "Lon: %{x:.2f}<br>" +
                         "<extra></extra>"
        ))
        
        # Add ocean condition layers
        for layer_name, layer_data in ocean_layers.items():
            if layer_data is None:
                continue
                
            # Define color scales with proper labels
            if layer_name == "temperature":
                colorscale = "RdBu_r"
                colorbar_title = "Temperature (°C)"
            elif layer_name == "salinity":
                colorscale = "Blues"
                colorbar_title = "Salinity (PSU)"
            elif layer_name == "oxygen":
                colorscale = "Viridis"
                colorbar_title = "Dissolved Oxygen (ml/l)"
            else:
                colorscale = layer_data['colorscale']
                colorbar_title = f"{layer_name.title()} ({layer_data['unit']})"
                
            fig.add_trace(go.Heatmap(
                z=layer_data['data'],
                x=layer_data['lon'],
                y=layer_data['lat'],
                colorscale=colorscale,
                name=f"{layer_name.title()} ({layer_data['unit']})",
                visible=True,
                opacity=0.7,
                colorbar=dict(
                    title=colorbar_title,
                    titleside="right",
                    tickmode="auto",
                    nticks=5
                ),
                hovertemplate=f"<b>{layer_name.title()}</b><br>" +
                             "Lat: %{y:.2f}<br>" +
                             "Lon: %{x:.2f}<br>" +
                             f"Value: %{{z:.2f}} {layer_data['unit']}<br>" +
                             "<extra></extra>"
            ))
        
        # Add biodiversity points
        if biodiversity_data and biodiversity_data['points']:
            # Create color mapping for species with better color palette
            unique_species = biodiversity_data['unique_species']
            # Use a more diverse color palette for better distinction
            colors = px.colors.qualitative.Plotly + px.colors.qualitative.Set1 + px.colors.qualitative.Set2
            species_color_map = {species: colors[i % len(colors)] 
                               for i, species in enumerate(unique_species)}
            
            # Group points by species for better visualization
            for i, species in enumerate(unique_species):
                species_mask = [s == species for s in biodiversity_data['species']]
                species_lats = [lat for j, lat in enumerate(biodiversity_data['lat']) if species_mask[j]]
                species_lons = [lon for j, lon in enumerate(biodiversity_data['lon']) if species_mask[j]]
                species_abundance = [ab for j, ab in enumerate(biodiversity_data['abundance']) if species_mask[j]]
                
                if species_lats:  # Only add if there are points for this species
                    # Calculate marker size based on abundance (log scale for better visualization)
                    marker_sizes = [max(6, min(25, 8 + np.log10(max(1, ab)) * 3)) for ab in species_abundance]
                    
                    fig.add_trace(go.Scatter(
                        x=species_lons,
                        y=species_lats,
                        mode='markers',
                        marker=dict(
                            size=marker_sizes,
                            color=species_color_map[species],
                            opacity=0.8,
                            line=dict(width=1, color='white'),
                            symbol='circle'
                        ),
                        name=f"Species: {species}",
                        visible=True,
                        hovertemplate=f"<b>{species}</b><br>" +
                                     "Lat: %{y:.2f}<br>" +
                                     "Lon: %{x:.2f}<br>" +
                                     "Abundance: %{customdata}<br>" +
                                     "<extra></extra>",
                        customdata=species_abundance
                    ))
        
        # Update layout
        fig.update_layout(
            title={
                'text': "Indian Ocean Conditions and Biodiversity Map",
                'x': 0.5,
                'xanchor': 'center',
                'font': {'size': 20}
            },
            xaxis_title="Longitude (°E)",
            yaxis_title="Latitude (°N)",
            width=1200,
            height=700,
            showlegend=True,
            legend=dict(
                orientation="v",
                yanchor="top",
                y=1,
                xanchor="left",
                x=1.02,
                bgcolor="rgba(255,255,255,0.8)",
                bordercolor="black",
                borderwidth=1,
                font=dict(size=10)
            ),
            plot_bgcolor='white',
            paper_bgcolor='white'
        )
        
        return fig
    
    def analyze_correlations(self, biodiversity_data, ocean_data):
        """Analyze correlations between ocean variables and species abundance"""
        if not biodiversity_data or not biodiversity_data['points']:
            return {"error": "No biodiversity data available"}
        
        correlations = {}
        
        # For each species, analyze correlation with ocean variables
        unique_species = biodiversity_data['unique_species']
        
        for species in unique_species:
            species_mask = [s == species for s in biodiversity_data['species']]
            species_lats = [lat for j, lat in enumerate(biodiversity_data['lat']) if species_mask[j]]
            species_lons = [lon for j, lon in enumerate(biodiversity_data['lon']) if species_mask[j]]
            species_abundance = [ab for j, ab in enumerate(biodiversity_data['abundance']) if species_mask[j]]
            
            if len(species_lats) < 3:  # Need at least 3 points for correlation
                continue
            
            species_correlations = {}
            
            for ocean_var, ocean_layer in ocean_data.items():
                if ocean_layer is None:
                    continue
                
                # Interpolate ocean values at biodiversity points
                ocean_values = []
                for lat, lon in zip(species_lats, species_lons):
                    # Find closest grid point
                    lat_idx = np.argmin(np.abs(np.array(ocean_layer['lat']) - lat))
                    lon_idx = np.argmin(np.abs(np.array(ocean_layer['lon']) - lon))
                    ocean_values.append(ocean_layer['data'][lat_idx][lon_idx])
                
                # Calculate correlation
                if len(ocean_values) > 1 and len(species_abundance) > 1:
                    correlation, p_value = stats.pearsonr(ocean_values, species_abundance)
                    species_correlations[ocean_var] = {
                        "correlation": float(correlation),
                        "p_value": float(p_value),
                        "significant": bool(p_value < 0.05)
                    }
            
            if species_correlations:
                correlations[species] = {
                    "sample_size": int(len(species_lats)),
                    "correlations": species_correlations
                }
        
        # Convert all numpy types to Python native types
        def convert_numpy_types(obj):
            if isinstance(obj, dict):
                return {key: convert_numpy_types(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_numpy_types(item) for item in obj]
            elif isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            elif isinstance(obj, np.bool_):
                return bool(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            else:
                return obj
        
        return convert_numpy_types(correlations)
    
    def get_species_analysis(self, species, biodiversity_data, ocean_data):
        """Get detailed analysis for a specific species"""
        if not biodiversity_data or not biodiversity_data['points']:
            return {"error": "No biodiversity data available"}
        
        # Filter data for the specific species
        species_mask = [s == species for s in biodiversity_data['species']]
        species_lats = [lat for j, lat in enumerate(biodiversity_data['lat']) if species_mask[j]]
        species_lons = [lon for j, lon in enumerate(biodiversity_data['lon']) if species_mask[j]]
        species_abundance = [ab for j, ab in enumerate(biodiversity_data['abundance']) if species_mask[j]]
        
        if len(species_lats) < 2:
            return {"error": f"Insufficient data for species {species}"}
        
        analysis = {
            "species": species,
            "sample_size": int(len(species_lats)),
            "abundance_stats": {
                "mean": float(np.mean(species_abundance)),
                "std": float(np.std(species_abundance)),
                "min": float(np.min(species_abundance)),
                "max": float(np.max(species_abundance))
            },
            "location_stats": {
                "lat_range": [float(np.min(species_lats)), float(np.max(species_lats))],
                "lon_range": [float(np.min(species_lons)), float(np.max(species_lons))]
            },
            "correlations": {},
            "scatter_plots": {}
        }
        
        # Analyze correlations with ocean variables
        for ocean_var, ocean_layer in ocean_data.items():
            if ocean_layer is None:
                continue
            
            # Interpolate ocean values
            ocean_values = []
            for lat, lon in zip(species_lats, species_lons):
                lat_idx = np.argmin(np.abs(np.array(ocean_layer['lat']) - lat))
                lon_idx = np.argmin(np.abs(np.abs(np.array(ocean_layer['lon']) - lon)))
                ocean_values.append(ocean_layer['data'][lat_idx][lon_idx])
            
            if len(ocean_values) > 1:
                correlation, p_value = stats.pearsonr(ocean_values, species_abundance)
                
                analysis["correlations"][ocean_var] = {
                    "correlation": float(correlation),
                    "p_value": float(p_value),
                    "significant": bool(p_value < 0.05)
                }
                
                # Create scatter plot data
                analysis["scatter_plots"][ocean_var] = {
                    "x": ocean_values,
                    "y": species_abundance,
                    "x_label": f"{ocean_var.title()} ({ocean_layer['unit']})",
                    "y_label": "Abundance",
                    "correlation": float(correlation),
                    "p_value": float(p_value)
                }
        
        # Convert all numpy types to Python native types
        def convert_numpy_types(obj):
            if isinstance(obj, dict):
                return {key: convert_numpy_types(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_numpy_types(item) for item in obj]
            elif isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            elif isinstance(obj, np.bool_):
                return bool(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            else:
                return obj
        
        return convert_numpy_types(analysis)
    
    def get_region_statistics(self, biodiversity_data, ocean_data):
        """Get regional statistics for the Indian Ocean area"""
        stats = {
            "biodiversity": {
                "total_species": len(biodiversity_data.get('unique_species', [])),
                "total_observations": len(biodiversity_data.get('points', [])),
                "coverage_area": "Indian Ocean (5°N-25°N, 65°E-95°E)"
            },
            "ocean_conditions": {},
            "cross_domain_insights": []
        }
        
        # Analyze ocean conditions
        for layer_name, layer_data in ocean_data.items():
            if layer_data:
                data_array = np.array(layer_data['data'])
                stats["ocean_conditions"][layer_name] = {
                    "mean": float(np.mean(data_array)),
                    "std": float(np.std(data_array)),
                    "min": float(np.min(data_array)),
                    "max": float(np.max(data_array)),
                    "unit": layer_data['unit']
                }
        
        return stats
    
    def create_cross_domain_analysis(self, biodiversity_data, ocean_data):
        """Create comprehensive cross-domain analysis visualizations"""
        visualizations = {}
        
        # 1. Correlation Heatmap
        visualizations['correlation_heatmap'] = self.create_correlation_heatmap(biodiversity_data, ocean_data)
        
        # 2. Scatter Plot Matrix
        visualizations['scatter_matrix'] = self.create_scatter_matrix(biodiversity_data, ocean_data)
        
        # 3. Species-Environment Relationships
        visualizations['species_environment'] = self.create_species_environment_plots(biodiversity_data, ocean_data)
        
        # 4. Environmental Gradients
        visualizations['environmental_gradients'] = self.create_environmental_gradient_plots(biodiversity_data, ocean_data)
        
        # 5. Biodiversity Hotspots
        visualizations['biodiversity_hotspots'] = self.create_biodiversity_hotspot_analysis(biodiversity_data, ocean_data)
        
        # 6. Statistical Summary
        visualizations['statistical_summary'] = self.create_statistical_summary(biodiversity_data, ocean_data)
        
        return visualizations
    
    def create_correlation_heatmap(self, biodiversity_data, ocean_data):
        """Create correlation heatmap between ocean conditions and species abundance"""
        if not biodiversity_data or not biodiversity_data['points']:
            return None
        
        # Get top 50 species by abundance for better coverage
        species_abundance = {}
        for i, species in enumerate(biodiversity_data['species']):
            abundance = biodiversity_data['abundance'][i]
            if species not in species_abundance:
                species_abundance[species] = 0
            species_abundance[species] += abundance
        
        top_species = sorted(species_abundance.items(), key=lambda x: x[1], reverse=True)[:50]
        top_species_names = [species for species, _ in top_species]
        
        # Prepare correlation matrix
        ocean_vars = list(ocean_data.keys())
        species_names = top_species_names
        
        correlation_matrix = []
        for species in species_names:
            species_correlations = []
            species_mask = [s == species for s in biodiversity_data['species']]
            species_lats = [lat for j, lat in enumerate(biodiversity_data['lat']) if species_mask[j]]
            species_lons = [lon for j, lon in enumerate(biodiversity_data['lon']) if species_mask[j]]
            species_abundance = [ab for j, ab in enumerate(biodiversity_data['abundance']) if species_mask[j]]
            
            if len(species_lats) < 3:
                species_correlations = [0] * len(ocean_vars)
            else:
                for ocean_var in ocean_vars:
                    ocean_layer = ocean_data[ocean_var]
                    if ocean_layer is None:
                        species_correlations.append(0)
                        continue
                    
                    # Interpolate ocean values
                    ocean_values = []
                    for lat, lon in zip(species_lats, species_lons):
                        lat_idx = np.argmin(np.abs(np.array(ocean_layer['lat']) - lat))
                        lon_idx = np.argmin(np.abs(np.array(ocean_layer['lon']) - lon))
                        ocean_values.append(ocean_layer['data'][lat_idx][lon_idx])
                    
                    if len(ocean_values) > 1 and len(species_abundance) > 1:
                        correlation, _ = stats.pearsonr(ocean_values, species_abundance)
                        species_correlations.append(float(correlation))
                    else:
                        species_correlations.append(0)
            
            correlation_matrix.append(species_correlations)
        
        # Create heatmap with detailed color information
        fig = go.Figure(data=go.Heatmap(
            z=correlation_matrix,
            x=ocean_vars,
            y=species_names,
            colorscale='RdBu',
            zmid=0,
            zmin=-1,
            zmax=1,
            text=[[f"{val:.3f}" for val in row] for row in correlation_matrix],
            texttemplate="%{text}",
            textfont={"size": 8},
            hoverongaps=False,
            colorbar=dict(
                title="Correlation Coefficient",
                titleside="right",
                tickmode="array",
                tickvals=[-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1],
                ticktext=["-1.0", "-0.8", "-0.6", "-0.4", "-0.2", "0.0", "0.2", "0.4", "0.6", "0.8", "1.0"],
                tickfont=dict(size=10)
            )
        ))
        
        fig.update_layout(
            title={
                'text': "Species-Environment Correlation Heatmap<br><sub>Red: Positive correlation, Blue: Negative correlation, White: No correlation</sub>",
                'x': 0.5,
                'xanchor': 'center',
                'font': {'size': 16}
            },
            xaxis_title="Ocean Variables",
            yaxis_title="Species (Top 50 by Abundance)",
            width=1000,
            height=800,
            font=dict(size=12),
            margin=dict(l=150, r=100, t=100, b=100)
        )
        
        # Remove unnecessary UI elements
        fig.update_layout(
            showlegend=False,
            dragmode=False
        )
        
        # Update config to remove zoom, pan, and other tools
        fig.update_layout(
            xaxis=dict(fixedrange=True),
            yaxis=dict(fixedrange=True)
        )
        
        return json.loads(plotly.io.to_json(fig))
    
    def create_scatter_matrix(self, biodiversity_data, ocean_data):
        """Create scatter plot matrix showing relationships between ocean variables and species abundance"""
        if not biodiversity_data or not biodiversity_data['points']:
            return None
        
        # Sample data for visualization (top 30 species)
        species_abundance = {}
        for i, species in enumerate(biodiversity_data['species']):
            abundance = biodiversity_data['abundance'][i]
            if species not in species_abundance:
                species_abundance[species] = 0
            species_abundance[species] += abundance
        
        top_species = sorted(species_abundance.items(), key=lambda x: x[1], reverse=True)[:30]
        top_species_names = [species for species, _ in top_species]
        
        # Prepare data for scatter matrix
        ocean_vars = list(ocean_data.keys())
        if len(ocean_vars) < 2:
            return None
        
        # Create subplots
        fig = make_subplots(
            rows=len(ocean_vars), 
            cols=len(ocean_vars),
            subplot_titles=[f"{var1} vs {var2}" for var1 in ocean_vars for var2 in ocean_vars],
            shared_xaxes=False,
            shared_yaxes=False
        )
        
        # Add scatter plots for each combination
        for i, var1 in enumerate(ocean_vars):
            for j, var2 in enumerate(ocean_vars):
                if i == j:
                    # Diagonal: histogram
                    continue
                
                # Get data for this combination
                x_data, y_data, colors = [], [], []
                
                for species in top_species_names:
                    species_mask = [s == species for s in biodiversity_data['species']]
                    species_lats = [lat for k, lat in enumerate(biodiversity_data['lat']) if species_mask[k]]
                    species_lons = [lon for k, lon in enumerate(biodiversity_data['lon']) if species_mask[k]]
                    species_abundance = [ab for k, ab in enumerate(biodiversity_data['abundance']) if species_mask[k]]
                    
                    if len(species_lats) < 2:
                        continue
                    
                    # Get ocean values
                    ocean_layer1 = ocean_data[var1]
                    ocean_layer2 = ocean_data[var2]
                    
                    if ocean_layer1 is None or ocean_layer2 is None:
                        continue
                    
                    var1_values, var2_values = [], []
                    for lat, lon in zip(species_lats, species_lons):
                        lat_idx = np.argmin(np.abs(np.array(ocean_layer1['lat']) - lat))
                        lon_idx = np.argmin(np.abs(np.array(ocean_layer1['lon']) - lon))
                        var1_values.append(ocean_layer1['data'][lat_idx][lon_idx])
                        
                        lat_idx = np.argmin(np.abs(np.array(ocean_layer2['lat']) - lat))
                        lon_idx = np.argmin(np.abs(np.array(ocean_layer2['lon']) - lon))
                        var2_values.append(ocean_layer2['data'][lat_idx][lon_idx])
                    
                    x_data.extend(var1_values)
                    y_data.extend(var2_values)
                    colors.extend([species] * len(var1_values))
                
                if x_data and y_data:
                    fig.add_trace(
                        go.Scatter(
                            x=x_data,
                            y=y_data,
                            mode='markers',
                            name=f"{var1} vs {var2}",
                            marker=dict(size=6, opacity=0.6),
                            showlegend=False
                        ),
                        row=i+1, col=j+1
                    )
        
        fig.update_layout(
            title={
                'text': "Ocean Variables Scatter Matrix<br><sub>Each plot shows relationship between two ocean variables</sub>",
                'x': 0.5,
                'xanchor': 'center',
                'font': {'size': 16}
            },
            width=1200,
            height=1000,
            font=dict(size=12),
            showlegend=False,
            dragmode=False
        )
        
        # Remove zoom and pan for all subplots
        for i in range(len(ocean_vars)):
            for j in range(len(ocean_vars)):
                fig.update_xaxes(fixedrange=True, row=i+1, col=j+1)
                fig.update_yaxes(fixedrange=True, row=i+1, col=j+1)
        
        return json.loads(plotly.io.to_json(fig))
    
    def create_species_environment_plots(self, biodiversity_data, ocean_data):
        """Create plots showing species-environment relationships"""
        if not biodiversity_data or not biodiversity_data['points']:
            return None
        
        # Get top 15 species for detailed analysis
        species_abundance = {}
        for i, species in enumerate(biodiversity_data['species']):
            abundance = biodiversity_data['abundance'][i]
            if species not in species_abundance:
                species_abundance[species] = 0
            species_abundance[species] += abundance
        
        top_species = sorted(species_abundance.items(), key=lambda x: x[1], reverse=True)[:15]
        top_species_names = [species for species, _ in top_species]
        
        # Create subplots for each ocean variable
        ocean_vars = list(ocean_data.keys())
        fig = make_subplots(
            rows=len(ocean_vars),
            cols=1,
            subplot_titles=[f"Species Abundance vs {var.title()}" for var in ocean_vars],
            vertical_spacing=0.1
        )
        
        for i, ocean_var in enumerate(ocean_vars):
            ocean_layer = ocean_data[ocean_var]
            if ocean_layer is None:
                continue
            
            for species in top_species_names:
                species_mask = [s == species for s in biodiversity_data['species']]
                species_lats = [lat for j, lat in enumerate(biodiversity_data['lat']) if species_mask[j]]
                species_lons = [lon for j, lon in enumerate(biodiversity_data['lon']) if species_mask[j]]
                species_abundance = [ab for j, ab in enumerate(biodiversity_data['abundance']) if species_mask[j]]
                
                if len(species_lats) < 2:
                    continue
                
                # Get ocean values
                ocean_values = []
                for lat, lon in zip(species_lats, species_lons):
                    lat_idx = np.argmin(np.abs(np.array(ocean_layer['lat']) - lat))
                    lon_idx = np.argmin(np.abs(np.array(ocean_layer['lon']) - lon))
                    ocean_values.append(ocean_layer['data'][lat_idx][lon_idx])
                
                if ocean_values and species_abundance:
                    # Calculate correlation
                    correlation, p_value = stats.pearsonr(ocean_values, species_abundance)
                    
                    fig.add_trace(
                        go.Scatter(
                            x=ocean_values,
                            y=species_abundance,
                            mode='markers',
                            name=f"{species} (r={correlation:.3f})",
                            marker=dict(size=8, opacity=0.7),
                            text=[f"Species: {species}<br>Abundance: {ab}<br>{ocean_var}: {ov:.2f}" 
                                  for ab, ov in zip(species_abundance, ocean_values)],
                            hovertemplate="%{text}<extra></extra>"
                        ),
                        row=i+1, col=1
                    )
        
        fig.update_layout(
            title={
                'text': "Species-Environment Relationships<br><sub>Each species is colored differently. Correlation coefficients (r) are shown in legend.</sub>",
                'x': 0.5,
                'xanchor': 'center',
                'font': {'size': 16}
            },
            width=1200,
            height=500 * len(ocean_vars),
            font=dict(size=12),
            showlegend=True,
            legend=dict(
                orientation="v",
                yanchor="top",
                y=1,
                xanchor="left",
                x=1.02,
                font=dict(size=10)
            ),
            dragmode=False
        )
        
        # Remove zoom and pan for all subplots
        for i in range(len(ocean_vars)):
            fig.update_xaxes(fixedrange=True, row=i+1, col=1)
            fig.update_yaxes(fixedrange=True, row=i+1, col=1)
        
        return json.loads(plotly.io.to_json(fig))
    
    def create_environmental_gradient_plots(self, biodiversity_data, ocean_data):
        """Create plots showing environmental gradients and species distribution"""
        if not biodiversity_data or not biodiversity_data['points']:
            return None
        
        # Create gradient plots for each ocean variable
        plots = {}
        
        for ocean_var, ocean_layer in ocean_data.items():
            if ocean_layer is None:
                continue
            
            # Create contour plot
            fig = go.Figure()
            
            # Add ocean data contour with detailed color information
            data_array = np.array(ocean_layer['data'])
            min_val, max_val = np.min(data_array), np.max(data_array)
            
            fig.add_trace(go.Contour(
                z=ocean_layer['data'],
                x=ocean_layer['lon'],
                y=ocean_layer['lat'],
                colorscale='Viridis',
                name=f"{ocean_var.title()} Gradient",
                showscale=True,
                colorbar=dict(
                    title=f"{ocean_var.title()} ({ocean_layer['unit']})",
                    titleside="right",
                    tickmode="array",
                    tickvals=[min_val, min_val + (max_val - min_val) * 0.25, min_val + (max_val - min_val) * 0.5, 
                             min_val + (max_val - min_val) * 0.75, max_val],
                    ticktext=[f"{min_val:.2f}", f"{(min_val + (max_val - min_val) * 0.25):.2f}", 
                             f"{(min_val + (max_val - min_val) * 0.5):.2f}", f"{(min_val + (max_val - min_val) * 0.75):.2f}", 
                             f"{max_val:.2f}"],
                    tickfont=dict(size=10)
                )
            ))
            
            # Add biodiversity points
            if biodiversity_data['points']:
                # Color points by abundance
                abundances = biodiversity_data['abundance']
                max_abundance = max(abundances) if abundances else 1
                normalized_abundance = [ab/max_abundance for ab in abundances]
                
                # Create abundance color scale with clear ranges
                max_abundance = max(abundances) if abundances else 1
                abundance_ranges = [0, 0.25, 0.5, 0.75, 1.0]
                abundance_labels = [f"{int(max_abundance * r)}" for r in abundance_ranges]
                
                fig.add_trace(go.Scatter(
                    x=biodiversity_data['lon'],
                    y=biodiversity_data['lat'],
                    mode='markers',
                    marker=dict(
                        size=[max(5, min(20, ab)) for ab in abundances],
                        color=normalized_abundance,
                        colorscale='Reds',
                        opacity=0.8,
                        showscale=True,
                        colorbar=dict(
                            title="Species Abundance",
                            titleside="right",
                            tickmode="array",
                            tickvals=abundance_ranges,
                            ticktext=abundance_labels,
                            tickfont=dict(size=10)
                        )
                    ),
                    name="Biodiversity Points",
                    text=[f"Species: {species}<br>Abundance: {ab}" 
                          for species, ab in zip(biodiversity_data['species'], abundances)],
                    hovertemplate="%{text}<extra></extra>"
                ))
            
            fig.update_layout(
                title={
                    'text': f"Environmental Gradient: {ocean_var.title()}<br><sub>Purple: Low values, Yellow: High values. Red dots: Species abundance</sub>",
                    'x': 0.5,
                    'xanchor': 'center',
                    'font': {'size': 16}
                },
                xaxis_title="Longitude (°E)",
                yaxis_title="Latitude (°N)",
                width=1000,
                height=700,
                font=dict(size=12),
                showlegend=False,
                dragmode=False
            )
            
            # Remove zoom and pan
            fig.update_xaxes(fixedrange=True)
            fig.update_yaxes(fixedrange=True)
            
            plots[ocean_var] = json.loads(plotly.io.to_json(fig))
        
        return plots
    
    def create_biodiversity_hotspot_analysis(self, biodiversity_data, ocean_data):
        """Create biodiversity hotspot analysis"""
        if not biodiversity_data or not biodiversity_data['points']:
            return None
        
        # Create density map
        fig = go.Figure()
        
        # Add ocean background (temperature as example)
        if 'temperature' in ocean_data and ocean_data['temperature']:
            temp_layer = ocean_data['temperature']
            fig.add_trace(go.Heatmap(
                z=temp_layer['data'],
                x=temp_layer['lon'],
                y=temp_layer['lat'],
                colorscale='Blues',
                opacity=0.3,
                name="Temperature Background",
                showscale=False
            ))
        
        # Create density grid
        lats = np.linspace(5, 25, 20)
        lons = np.linspace(65, 95, 20)
        
        # Calculate species density in each grid cell
        density_grid = np.zeros((len(lats), len(lons)))
        
        for i, lat in enumerate(lats):
            for j, lon in enumerate(lons):
                # Count species within 1 degree radius
                lat_mask = np.abs(np.array(biodiversity_data['lat']) - lat) < 1
                lon_mask = np.abs(np.array(biodiversity_data['lon']) - lon) < 1
                combined_mask = lat_mask & lon_mask
                
                if np.any(combined_mask):
                    # Count unique species in this area
                    species_in_area = [biodiversity_data['species'][k] for k in range(len(biodiversity_data['species'])) if combined_mask[k]]
                    density_grid[i, j] = len(set(species_in_area))
        
        # Add density heatmap with clear color ranges
        max_density = np.max(density_grid)
        density_ranges = [0, max_density * 0.25, max_density * 0.5, max_density * 0.75, max_density]
        density_labels = [f"{int(r)}" for r in density_ranges]
        
        fig.add_trace(go.Heatmap(
            z=density_grid,
            x=lons,
            y=lats,
            colorscale='Reds',
            name="Species Density",
            showscale=True,
            colorbar=dict(
                title="Species Count per Grid Cell",
                titleside="right",
                tickmode="array",
                tickvals=[0, 0.25, 0.5, 0.75, 1.0],
                ticktext=density_labels,
                tickfont=dict(size=10)
            )
        ))
        
        # Add individual species points
        fig.add_trace(go.Scatter(
            x=biodiversity_data['lon'],
            y=biodiversity_data['lat'],
            mode='markers',
            marker=dict(
                size=6,
                color='yellow',
                opacity=0.6,
                line=dict(width=1, color='black')
            ),
            name="Species Locations",
            text=[f"Species: {species}<br>Abundance: {ab}" 
                  for species, ab in zip(biodiversity_data['species'], biodiversity_data['abundance'])],
            hovertemplate="%{text}<extra></extra>"
        ))
        
        fig.update_layout(
            title={
                'text': "Biodiversity Hotspots Analysis<br><sub>Red areas: High species density. Yellow dots: Individual species locations</sub>",
                'x': 0.5,
                'xanchor': 'center',
                'font': {'size': 16}
            },
            xaxis_title="Longitude (°E)",
            yaxis_title="Latitude (°N)",
            width=1200,
            height=800,
            font=dict(size=12),
            showlegend=False,
            dragmode=False
        )
        
        # Remove zoom and pan
        fig.update_xaxes(fixedrange=True)
        fig.update_yaxes(fixedrange=True)
        
        return json.loads(plotly.io.to_json(fig))
    
    def create_statistical_summary(self, biodiversity_data, ocean_data):
        """Create statistical summary of cross-domain analysis"""
        summary = {
            "biodiversity_summary": {
                "total_species": len(biodiversity_data.get('unique_species', [])),
                "total_observations": len(biodiversity_data.get('points', [])),
                "abundance_stats": {
                    "mean": float(np.mean(biodiversity_data.get('abundance', [0]))),
                    "std": float(np.std(biodiversity_data.get('abundance', [0]))),
                    "min": float(np.min(biodiversity_data.get('abundance', [0]))),
                    "max": float(np.max(biodiversity_data.get('abundance', [0])))
                }
            },
            "ocean_conditions_summary": {},
            "correlation_insights": []
        }
        
        # Ocean conditions summary
        for var, layer in ocean_data.items():
            if layer:
                data_array = np.array(layer['data'])
                summary["ocean_conditions_summary"][var] = {
                    "mean": float(np.mean(data_array)),
                    "std": float(np.std(data_array)),
                    "min": float(np.min(data_array)),
                    "max": float(np.max(data_array)),
                    "unit": layer['unit']
                }
        
        # Correlation insights
        correlations = self.analyze_correlations(biodiversity_data, ocean_data)
        if isinstance(correlations, dict) and 'error' not in correlations:
            significant_correlations = []
            for species, data in correlations.items():
                if isinstance(data, dict) and 'correlations' in data:
                    for var, corr_data in data['correlations'].items():
                        if corr_data.get('significant', False):
                            significant_correlations.append({
                                "species": species,
                                "variable": var,
                                "correlation": corr_data['correlation'],
                                "p_value": corr_data['p_value']
                            })
            
            summary["correlation_insights"] = significant_correlations[:10]  # Top 10
        
        return summary
