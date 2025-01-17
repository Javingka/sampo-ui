export const instanceQuery = `
  SELECT * {
    BIND(<ID> as ?id)
    <PROPERTIES>
    <RELATED_INSTANCES>
  }
`

export const countQueryNamedGraph = `
  SELECT (COUNT(DISTINCT ?id) as ?count)
  WHERE {
    <NAMED_GRAPH_OPEN>
      <FILTER>
      VALUES ?facetClass { <FACET_CLASS> }
      ?id a ?facetClass .
    <NAMED_GRAPH_CLOSE>
  }
`
export const countQuery = `
  SELECT (COUNT(DISTINCT ?id) as ?count)
  WHERE {
    <FILTER>
    VALUES ?facetClass { <FACET_CLASS> }
    ?id a ?facetClass .
  }
`

export const jenaQuery = `
  SELECT *
  WHERE {
    <QUERY>
    <RESULT_SET_PROPERTIES>
  }
`

export const fullTextQuery = `
  SELECT *
  WHERE {
    <QUERY>
    <RESULT_SET_PROPERTIES>
  }
`
export const facetResultSetQueryNamedGraph = `
  SELECT *
  WHERE {
    <NAMED_GRAPH_OPEN>
    {
      # score and literal are used only for Jena full text index
      SELECT ?id ?score ?literal {
        <FILTER>
        VALUES ?facetClass { <FACET_CLASS> }
        ?id a ?facetClass .
        <ORDER_BY_TRIPLE>
      }
      <ORDER_BY>
      <PAGE>
    }
    FILTER(BOUND(?id))
    <RESULT_SET_PROPERTIES>
    <NAMED_GRAPH_CLOSE>
  }
`
export const facetResultSetQuery = `
  SELECT *
  WHERE {
    {
      # score and literal are used only for Jena full text index
      SELECT ?id ?score ?literal {
        <FILTER>
        VALUES ?facetClass { <FACET_CLASS> }
        ?id a ?facetClass .
        <ORDER_BY_TRIPLE>
      }
      <ORDER_BY>
      <PAGE>
    }
    FILTER(BOUND(?id))
    <RESULT_SET_PROPERTIES>
  }
`

export const facetValuesQuery = `
  SELECT DISTINCT ?id ?prefLabel ?selected ?parent ?instanceCount {
    {
      {
        SELECT DISTINCT (count(DISTINCT ?instance) as ?instanceCount) ?id ?parent ?selected {
          # facet values that return results
          {
            <FILTER>
            ?instance <PREDICATE> ?id .
            <PARENTS>
            VALUES ?facetClass { <FACET_CLASS> }
            ?instance a ?facetClass .
            <SELECTED_VALUES>
          }
          <SELECTED_VALUES_NO_HITS>     
          BIND(COALESCE(?selected_, false) as ?selected)
        }
        GROUP BY ?id ?parent ?selected
      }
      FILTER(BOUND(?id))
      <FACET_VALUE_FILTER>
      <LABELS>
    }
    <UNKNOWN_VALUES>
  }
  <ORDER_BY>
`
export const facetValuesQueryTimespanNamedGraph = `
  # ignore selections from other facets
  SELECT ?min ?max {
    <NAMED_GRAPH_OPEN>
    {
      SELECT (MIN(?start) AS ?min) {
        ?instance <PREDICATE> ?timespan .
        VALUES ?facetClass { <FACET_CLASS> }
        ?instance a ?facetClass .
        ?timespan <START_PROPERTY> ?start .
        <FACET_VALUE_FILTER>
      }
    }
    {
      SELECT (MAX(?end) AS ?max) {
        ?instance <PREDICATE> ?timespan .
        VALUES ?facetClass { <FACET_CLASS> }
        ?instance a ?facetClass .
        ?timespan <END_PROPERTY> ?end .
        <FACET_VALUE_FILTER>
      }
    }
    <NAMED_GRAPH_CLOSE>
  }
`

export const facetValuesQueryTimespan = `
  # ignore selections from other facets
  SELECT ?min ?max {
    {
      SELECT (MIN(?start) AS ?min) {
        ?instance <PREDICATE> ?timespan .
        VALUES ?facetClass { <FACET_CLASS> }
        ?instance a ?facetClass .
        ?timespan <START_PROPERTY> ?start .
        <FACET_VALUE_FILTER>
      }
    }
    {
      SELECT (MAX(?end) AS ?max) {
        ?instance <PREDICATE> ?timespan .
        VALUES ?facetClass { <FACET_CLASS> }
        ?instance a ?facetClass .
        ?timespan <END_PROPERTY> ?end .
        <FACET_VALUE_FILTER>
      }
    }
  }
`

export const facetValuesRangeNamedGraph = `
  # ignore selections from other facets
  SELECT (MIN(?value) AS ?min) (MAX(?value) AS ?max) {

    <NAMED_GRAPH_OPEN>
      ?instance <PREDICATE> ?value .
      VALUES ?facetClass { <FACET_CLASS> }
      ?instance a ?facetClass .
      <FACET_VALUE_FILTER>
    <NAMED_GRAPH_CLOSE>
  }
`

export const facetValuesRange = `
  # ignore selections from other facets
  SELECT (MIN(?value) AS ?min) (MAX(?value) AS ?max) {
    ?instance <PREDICATE> ?value .
    VALUES ?facetClass { <FACET_CLASS> }
    ?instance a ?facetClass .
    <FACET_VALUE_FILTER>
  }
`

export const sitemapInstancePageQuery = `
  SELECT DISTINCT ?path 
  WHERE {
    VALUES ?resultClass { <RESULT_CLASS> }
    ?uri a ?resultClass .
    BIND(CONCAT("<PERSPECTIVE>/page/", REPLACE(STR(?uri), "^.*\\\\/(.+)", "$1"), "/<DEFAULT_TAB>") AS ?path)
  }
  LIMIT 100
`
