import { readFile } from 'fs/promises'
import { has } from 'lodash'
import { processResultClassConfig } from './processResultClassConfig'

export const createBackendSearchInstanceConfig = async (portalID, onlyInstancePages, resultMappers) => {
    const backedSearchInstanceConfig = {}

    for (const perspectiveID of onlyInstancePages) {
        const perspectiveConfigJSON = await readFile(`src/configs/${portalID}/only_instance_pages/${perspectiveID}.json`)
        const perspectiveConfig = JSON.parse(perspectiveConfigJSON)
        const { sparqlQueriesFile } = perspectiveConfig
        const sparqlQueries = await import(`../../sparql/${portalID}/sparql_queries/${sparqlQueriesFile}`)
        const { instanceConfig } = perspectiveConfig.resultClasses[perspectiveID]
        const instancePagePropertiesQueryBlockID = instanceConfig.propertiesQueryBlock
        const instancePagePropertiesQueryBlock = sparqlQueries[instancePagePropertiesQueryBlockID]
        instanceConfig.propertiesQueryBlock = instancePagePropertiesQueryBlock

        if (instanceConfig.postprocess) {
            instanceConfig.postprocess.func = resultMappers[instanceConfig.postprocess.func]
        }
        let hasInstancePageResultClasses = false
        let extraResultClasses = {} // gather nested result classes here
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
            perspectiveConfig.resultClasses = {
                ...perspectiveConfig.resultClasses,
                ...extraResultClasses
            }
            hasInstancePageResultClasses = true
        }
        if (hasInstancePageResultClasses) {
            perspectiveConfig.resultClasses = {
                ...perspectiveConfig.resultClasses,
                ...perspectiveConfig.resultClasses[perspectiveID].instanceConfig.instancePageResultClasses
            }
        }
        const { prefixesFile } = perspectiveConfig.endpoint
        const { prefixes } = await import(`../../sparql/${portalID}/sparql_queries/${prefixesFile}`)
        perspectiveConfig.endpoint.prefixes = prefixes
        backedSearchInstanceConfig[perspectiveID] = perspectiveConfig
    }

    return { backedSearchInstanceConfig }
}
