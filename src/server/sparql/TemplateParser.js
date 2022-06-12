
export const parseNamedGraph = (q, perspectiveConfig) => {
  // fill template with named graph pattern
  const namedGraph = perspectiveConfig.namedGraph 
  // console.log('namedGraph: ', namedGraph)
  if(namedGraph && namedGraph.length > 0 ){
    q = q.replace('<NAMED_GRAPH_OPEN>', `GRAPH ${namedGraph} {`)
    q = q.replace('<NAMED_GRAPH_CLOSE>', `}`)

    // console.log('query: ', q)
  } else {
    q = q.replace('<NAMED_GRAPH_OPEN>', '')
    q = q.replace('<NAMED_GRAPH_CLOSE>', '')
    // console.log('query: ', q)
  }

  return q
}