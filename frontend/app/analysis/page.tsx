'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const PlotlyComponent = dynamic(() => import('react-plotly.js'), { ssr: false });

type CrossDomainAnalysis = {
  visualizations: {
    correlation_heatmap: any;
    scatter_matrix: any;
    species_environment: any;
    environmental_gradients: any;
    biodiversity_hotspots: any;
    statistical_summary: any;
  };
  metadata: {
    analysis_type: string;
    biodiversity_species: number;
    biodiversity_points: number;
    ocean_variables: string[];
    region: string;
  };
};

const AnalysisPage = () => {
  const [crossDomainData, setCrossDomainData] = useState<CrossDomainAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'correlations' | 'gradients' | 'hotspots' | 'statistics'>('overview');

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    loadCrossDomainAnalysis();
  }, []);

  const loadCrossDomainAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cross-domain-analysis`);
      if (!response.ok) {
        if (response.status === 0 || response.status >= 500) {
          throw new Error('Backend server is not running. Please start it with: python app.py');
        }
        throw new Error('Failed to load cross-domain analysis data');
      }
      const data = (await response.json()) as CrossDomainAnalysis;
      setCrossDomainData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading cross-domain analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen text-black flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Cross-Domain Ocean-Biodiversity Analysis</h1>

        {/* Overview Stats */}
        {crossDomainData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Species Analyzed</h3>
              <p className="text-3xl font-bold text-blue-600">{crossDomainData.metadata.biodiversity_species}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Data Points</h3>
              <p className="text-3xl font-bold text-green-600">{crossDomainData.metadata.biodiversity_points}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Ocean Variables</h3>
              <p className="text-3xl font-bold text-purple-600">{crossDomainData.metadata.ocean_variables.length}</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800">Analysis Type</h3>
              <p className="text-sm font-medium text-orange-600">Cross-Domain</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('correlations')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'correlations'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Correlations
          </button>
          <button
            onClick={() => setActiveTab('gradients')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'gradients'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Environmental Gradients
          </button>
          <button
            onClick={() => setActiveTab('hotspots')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'hotspots'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Biodiversity Hotspots
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'statistics'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Analysis Overview</h2>
            <p className="text-gray-600 mb-6">
              This cross-domain analysis connects ocean conditions (temperature, salinity, oxygen) with biodiversity data 
              to reveal patterns and relationships in the Indian Ocean ecosystem.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Analysis Components</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    <span>Correlation Heatmaps</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>Scatter Plot Matrices</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    <span>Species-Environment Relationships</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    <span>Environmental Gradients</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    <span>Biodiversity Hotspots</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Key Insights</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Temperature gradients influence species distribution patterns</li>
                  <li>• Salinity variations affect marine biodiversity hotspots</li>
                  <li>• Oxygen levels correlate with species abundance</li>
                  <li>• Cross-domain analysis reveals ecosystem dynamics</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'correlations' && crossDomainData && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Species-Environment Correlations</h2>
            <p className="text-gray-600 mb-6">
              Correlation analysis between ocean conditions and species abundance patterns.
            </p>
            
            {/* Color Legend for Correlations */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3">Correlation Color Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Positive Correlation (Red)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>0.8 - 1.0:</strong> Very strong positive relationship</li>
                    <li>• <strong>0.6 - 0.8:</strong> Strong positive relationship</li>
                    <li>• <strong>0.4 - 0.6:</strong> Moderate positive relationship</li>
                    <li>• <strong>0.2 - 0.4:</strong> Weak positive relationship</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">No Correlation (White)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>-0.2 - 0.2:</strong> No significant relationship</li>
                    <li>• Values close to 0 indicate no correlation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-600 mb-2">Negative Correlation (Blue)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>-0.2 - -0.4:</strong> Weak negative relationship</li>
                    <li>• <strong>-0.4 - -0.6:</strong> Moderate negative relationship</li>
                    <li>• <strong>-0.6 - -0.8:</strong> Strong negative relationship</li>
                    <li>• <strong>-0.8 - -1.0:</strong> Very strong negative relationship</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Correlation Heatmap */}
              {crossDomainData.visualizations.correlation_heatmap && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Correlation Heatmap</h3>
                  <div className="w-full h-96">
                    <PlotlyComponent
                      data={crossDomainData.visualizations.correlation_heatmap.data}
                      layout={{
                        ...crossDomainData.visualizations.correlation_heatmap.layout,
                        height: 400,
                        margin: { l: 50, r: 50, t: 50, b: 50 },
                        autosize: true,
                      }}
                      config={{ 
                        responsive: true,
                        displayModeBar: false,
                        staticPlot: true
                      }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              )}

              {/* Scatter Matrix */}
              {crossDomainData.visualizations.scatter_matrix && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Ocean Variables Scatter Matrix</h3>
                  <div className="w-full h-96">
                    <PlotlyComponent
                      data={crossDomainData.visualizations.scatter_matrix.data}
                      layout={{
                        ...crossDomainData.visualizations.scatter_matrix.layout,
                        height: 400,
                        margin: { l: 50, r: 50, t: 50, b: 50 },
                        autosize: true,
                      }}
                      config={{ 
                        responsive: true,
                        displayModeBar: false,
                        staticPlot: true
                      }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              )}

              {/* Species-Environment Relationships */}
              {crossDomainData.visualizations.species_environment && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Species-Environment Relationships</h3>
                  <div className="w-full h-96">
                    <PlotlyComponent
                      data={crossDomainData.visualizations.species_environment.data}
                      layout={{
                        ...crossDomainData.visualizations.species_environment.layout,
                        height: 400,
                        margin: { l: 50, r: 50, t: 50, b: 50 },
                        autosize: true,
                      }}
                      config={{ 
                        responsive: true,
                        displayModeBar: false,
                        staticPlot: true
                      }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'gradients' && crossDomainData && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Environmental Gradients</h2>
            <p className="text-gray-600 mb-6">
              Environmental gradient analysis showing how ocean conditions vary across the region and influence species distribution.
            </p>
            
            {/* Color Legend for Environmental Gradients */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3">Environmental Gradient Color Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-purple-600 mb-2">Ocean Conditions (Viridis Scale)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Purple:</strong> Lowest values in the region</li>
                    <li>• <strong>Blue:</strong> Low to moderate values</li>
                    <li>• <strong>Green:</strong> Moderate values</li>
                    <li>• <strong>Yellow:</strong> High values</li>
                    <li>• <strong>White:</strong> Highest values in the region</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Species Abundance (Red Scale)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Light Red:</strong> Low abundance (0-25% of max)</li>
                    <li>• <strong>Medium Red:</strong> Moderate abundance (25-50% of max)</li>
                    <li>• <strong>Dark Red:</strong> High abundance (50-75% of max)</li>
                    <li>• <strong>Very Dark Red:</strong> Very high abundance (75-100% of max)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              {crossDomainData.visualizations.environmental_gradients && 
               Object.entries(crossDomainData.visualizations.environmental_gradients).map(([variable, plotData]: [string, any]) => (
                <div key={variable}>
                  <h3 className="text-xl font-semibold mb-4">{variable.charAt(0).toUpperCase() + variable.slice(1)} Gradient</h3>
                  <div className="w-full h-96">
                    <PlotlyComponent
                      data={plotData.data}
                      layout={{
                        ...plotData.layout,
                        height: 400,
                        margin: { l: 50, r: 50, t: 50, b: 50 },
                        autosize: true,
                      }}
                      config={{ 
                        responsive: true,
                        displayModeBar: false,
                        staticPlot: true
                      }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hotspots' && crossDomainData && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Biodiversity Hotspots</h2>
            <p className="text-gray-600 mb-6">
              Analysis of biodiversity hotspots showing areas of high species density and their relationship to ocean conditions.
            </p>
            
            {/* Color Legend for Biodiversity Hotspots */}
            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3">Biodiversity Hotspots Color Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Species Density (Red Scale)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>White/Light Red:</strong> 0-25% of max species count</li>
                    <li>• <strong>Medium Red:</strong> 25-50% of max species count</li>
                    <li>• <strong>Dark Red:</strong> 50-75% of max species count</li>
                    <li>• <strong>Very Dark Red:</strong> 75-100% of max species count</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-600 mb-2">Individual Species Points</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Yellow Dots:</strong> Individual species observation locations</li>
                    <li>• <strong>Size:</strong> Larger dots indicate higher abundance</li>
                    <li>• <strong>Density:</strong> Red areas show where many species overlap</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {crossDomainData.visualizations.biodiversity_hotspots && (
              <div className="w-full h-96">
                <PlotlyComponent
                  data={crossDomainData.visualizations.biodiversity_hotspots.data}
                  layout={{
                    ...crossDomainData.visualizations.biodiversity_hotspots.layout,
                    height: 400,
                    margin: { l: 50, r: 50, t: 50, b: 50 },
                    autosize: true,
                  }}
                  config={{ responsive: true }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'statistics' && crossDomainData && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Statistical Summary</h2>
            <p className="text-gray-600 mb-6">
              Comprehensive statistical analysis of the cross-domain relationships between ocean conditions and biodiversity.
            </p>
            
            {crossDomainData.visualizations.statistical_summary && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Biodiversity Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Species</p>
                      <p className="text-2xl font-bold">{crossDomainData.visualizations.statistical_summary.biodiversity_summary.total_species}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Observations</p>
                      <p className="text-2xl font-bold">{crossDomainData.visualizations.statistical_summary.biodiversity_summary.total_observations}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mean Abundance</p>
                      <p className="text-2xl font-bold">{crossDomainData.visualizations.statistical_summary.biodiversity_summary.abundance_stats.mean.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Max Abundance</p>
                      <p className="text-2xl font-bold">{crossDomainData.visualizations.statistical_summary.biodiversity_summary.abundance_stats.max}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Ocean Conditions Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(crossDomainData.visualizations.statistical_summary.ocean_conditions_summary).map(([variable, stats]: [string, any]) => (
                      <div key={variable} className="bg-white p-4 rounded">
                        <h4 className="font-semibold capitalize">{variable}</h4>
                        <div className="text-sm space-y-1">
                          <p>Mean: {stats.mean.toFixed(2)} {stats.unit}</p>
                          <p>Range: {stats.min.toFixed(2)} - {stats.max.toFixed(2)} {stats.unit}</p>
                          <p>Std Dev: {stats.std.toFixed(2)} {stats.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {crossDomainData.visualizations.statistical_summary.correlation_insights && 
                 crossDomainData.visualizations.statistical_summary.correlation_insights.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Significant Correlations</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">Species</th>
                            <th className="px-4 py-2 text-left">Variable</th>
                            <th className="px-4 py-2 text-left">Correlation</th>
                            <th className="px-4 py-2 text-left">P-value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {crossDomainData.visualizations.statistical_summary.correlation_insights.map((insight: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-2">{insight.species}</td>
                              <td className="px-4 py-2 capitalize">{insight.variable}</td>
                              <td className="px-4 py-2">{insight.correlation.toFixed(3)}</td>
                              <td className="px-4 py-2">{insight.p_value.toFixed(3)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;