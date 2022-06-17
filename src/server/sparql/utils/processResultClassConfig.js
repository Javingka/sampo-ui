
export const processResultClassConfig = (resultClassConfig, sparqlQueries, resultMappers) => {
    if (resultClassConfig.sparqlQuery) {
        resultClassConfig.sparqlQuery = sparqlQueries[resultClassConfig.sparqlQuery]
    }
    if (resultClassConfig.sparqlQueryNodes) {
        resultClassConfig.sparqlQueryNodes = sparqlQueries[resultClassConfig.sparqlQueryNodes]
    }
    if (resultClassConfig.instanceConfig) {
        const { instanceConfig } = resultClassConfig
        if (instanceConfig.propertiesQueryBlock) {
            instanceConfig.propertiesQueryBlock = sparqlQueries[instanceConfig.propertiesQueryBlock]
        }
        if (instanceConfig.relatedInstances) {
            instanceConfig.relatedInstances = sparqlQueries[instanceConfig.relatedInstances]
        }
    }
    if (resultClassConfig.resultMapper) {
        resultClassConfig.resultMapper = resultMappers[resultClassConfig.resultMapper]
    }
    if (resultClassConfig.postprocess) {
        resultClassConfig.postprocess.func = resultMappers[resultClassConfig.postprocess.func]
    }
}