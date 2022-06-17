import { readFile } from 'fs/promises'
import { has } from 'lodash'
import { processResultClassConfig } from './processResultClassConfig'

export const createBackendSearchPerspectiveConfig = async (portalID, searchPerspectives, resultMappers) => {

    const backendSearchConfig = {}
    for (const perspectiveID of searchPerspectives) {
        const perspectiveConfigJSON = await readFile(`src/configs/${portalID}/search_perspectives/${perspectiveID}.json`)

        // retrieve the config object of the search perspective
        const perspectiveConfig = JSON.parse(perspectiveConfigJSON)

        // skip dummy perspectives 
        if (!has(perspectiveConfig, 'sparqlQueriesFile')) { continue }

        // grab the file holding the queries to be applied
        const { sparqlQueriesFile } = perspectiveConfig
        const sparqlQueries = await import(`../../sparql/${portalID}/sparql_queries/${sparqlQueriesFile}`)

        // when exists retrieve the prefixes from the file and added as a property
        if (has(perspectiveConfig, 'endpoint')) {
            const { prefixesFile } = perspectiveConfig.endpoint
            const { prefixes } = await import(`../../sparql/${portalID}/sparql_queries/${prefixesFile}`)
            perspectiveConfig.endpoint.prefixes = prefixes
        }

        processSearchModes(perspectiveConfig, sparqlQueries, perspectiveID, resultMappers)

        // console.log(perspectiveID, ': ', perspectiveConfig)
        backendSearchConfig[perspectiveID] = perspectiveConfig
    }

    return {
      backendSearchPerspectiveConfig: backendSearchConfig
    }
}

const processSearchModes = (perspectiveConfig, sparqlQueries, perspectiveID, resultMappers) => {
    const searchMode = perspectiveConfig.searchMode
    if (searchMode === 'faceted-search') {
        let extraResultClasses = {} // gather nested result classes here
        let hasInstancePageResultClasses = false
        const { paginatedResultsConfig, instanceConfig } = perspectiveConfig.resultClasses[perspectiveID]

        processMainFacetedSearch(paginatedResultsConfig, sparqlQueries, resultMappers)
        processInstanceFacetedSearch(instanceConfig, sparqlQueries, extraResultClasses, hasInstancePageResultClasses, resultMappers)
        processExtraFacetedSearch(perspectiveConfig.resultClasses, sparqlQueries, extraResultClasses, perspectiveID, resultMappers)

        perspectiveConfig.resultClasses = {
            ...perspectiveConfig.resultClasses,
            ...extraResultClasses
        }
        // merge facet results and instance page result classes
        if (hasInstancePageResultClasses) {
            perspectiveConfig.resultClasses = {
                ...perspectiveConfig.resultClasses,
                ...perspectiveConfig.resultClasses[perspectiveID].instanceConfig.instancePageResultClasses
            }
        }

        return perspectiveConfig
    }

    if (searchMode === 'federated-search') {
        for (const dataset in perspectiveConfig.datasets) {
            perspectiveConfig.datasets[dataset].resultQuery = sparqlQueries.federatedSearchSparqlQueries[dataset].resultQuery
        }
    }

    if (searchMode === 'full-text-search') {
        const queryBlockID = perspectiveConfig.propertiesQueryBlock
        const queryBlock = sparqlQueries[queryBlockID]
        perspectiveConfig.propertiesQueryBlock = queryBlock
    }
}

/**
 * handle default resultClass which is same as perspectiveID
 * @param {*} paginatedResultsConfig 
 * @param {*} sparqlQueries 
 */
const processMainFacetedSearch = (paginatedResultsConfig, sparqlQueries, resultMappers) => {
    // get the name of the variable holding the query template to be applied
    const paginatedResultsPropertiesQueryBlockID = paginatedResultsConfig.propertiesQueryBlock
    // get the actual query template string
    const paginatedResultsPropertiesQueryBlock = sparqlQueries[paginatedResultsPropertiesQueryBlockID]
    // replace the name of the query template by the actual query template
    paginatedResultsConfig.propertiesQueryBlock = paginatedResultsPropertiesQueryBlock

    if (paginatedResultsConfig.postprocess) {
        paginatedResultsConfig.postprocess.func = resultMappers[paginatedResultsConfig.postprocess.func]
    }
}

const processInstanceFacetedSearch = (instanceConfig, sparqlQueries, extraResultClasses, hasInstancePageResultClasses, resultMappers) => {
    // check if there is configuration for query Instances of the Classes
    if (instanceConfig) {
        const instancePagePropertiesQueryBlockID = instanceConfig.propertiesQueryBlock
        const instancePagePropertiesQueryBlock = sparqlQueries[instancePagePropertiesQueryBlockID]
        instanceConfig.propertiesQueryBlock = instancePagePropertiesQueryBlock
        if (instanceConfig.postprocess) {
            instanceConfig.postprocess.func = resultMappers[instanceConfig.postprocess.func]
        }
        if (has(instanceConfig, 'instancePageResultClasses')) {
            for (const instancePageResultClass in instanceConfig.instancePageResultClasses) {
                const instancePageResultClassConfig = instanceConfig.instancePageResultClasses[instancePageResultClass]
                processResultClassConfig(instancePageResultClassConfig, sparqlQueries, resultMappers)
                if (instancePageResultClassConfig.resultClasses) {
                    for (const extraResultClass in instancePageResultClassConfig.resultClasses) {
                        processResultClassConfig(instancePageResultClassConfig.resultClasses[extraResultClass], sparqlQueries, resultMappers)
                    }
                    extraResultClasses = {
                        ...extraResultClasses,
                        ...instancePageResultClassConfig.resultClasses
                    }
                }
            }
            hasInstancePageResultClasses = true
        }
    }
}

const processExtraFacetedSearch = (perspectiveConfigResultClasses, sparqlQueries, extraResultClasses, perspectiveID, resultMappers) => {

    // handle other resultClasses
    for (const resultClass in perspectiveConfigResultClasses) {

        //skip the resultClass main configuration
        if (resultClass === perspectiveID) { continue }

        const resultClassConfig = perspectiveConfigResultClasses[resultClass]
        processResultClassConfig(resultClassConfig, sparqlQueries, resultMappers)
        if (resultClassConfig.resultClasses) {
            for (const extraResultClass in resultClassConfig.resultClasses) {
                processResultClassConfig(resultClassConfig.resultClasses[extraResultClass], sparqlQueries, resultMappers)
            }
            extraResultClasses = {
                ...extraResultClasses,
                ...resultClassConfig.resultClasses
            }
        }
    }

}


