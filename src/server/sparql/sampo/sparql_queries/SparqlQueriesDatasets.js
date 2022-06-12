const perspectiveID = 'datasets'

export const datasetProperties = `
    {
      ?id rdfs:label ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
      BIND(?id as ?uri__id)
      BIND(?id as ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
    }
    UNION
    {
      ?id dw:countRows ?countrows__prefLabel .
    }
    UNION
    {
      ?id dw:nAttributes ?nAttributes__prefLabel .
    }
    UNION
    {
      ?id dw:countFeaturesWithNull ?countFeaturesWithNull__prefLabel .
    }
    UNION
    {
      ?id dct:source ?source__id .
      ?source__id rdfs:label ?source__prefLabel .
    }
    UNION
    {
      ?id dw:hasColumn ?fields__id .
      ?fields__id rdfs:label ?fields__prefLabel .
    }
    UNION
    {
      ?id ^frbroo:R19_created_a_realisation_of/frbroo:R17_created ?expression__id .
      ?expression__id rdfs:label ?expression__prefLabel .
      OPTIONAL {
        ?expression__id crm:P72_has_language ?language__id .
        ?expression__id dct:source ?language__source__id .
        ?language__source__id rdfs:label ?language__source__prefLabel .
        ?language__id rdfs:label ?language__prefLabel .
      }
    }
    UNION
    {
      ?id ^mmm-schema:manuscript_work/^crm:P108_has_produced/crm:P4_has_time-span ?productionTimespan__id .
      ?productionTimespan__id rdfs:label ?productionTimespan__prefLabel .
      ?productionTimespan__id dct:source ?productionTimespan__source__id .
      ?productionTimespan__source__id rdfs:label ?productionTimespan__source__prefLabel .
      OPTIONAL { ?productionTimespan__id crm:P82a_begin_of_the_begin ?productionTimespan__start }
      OPTIONAL { ?productionTimespan__id crm:P82b_end_of_the_end ?productionTimespan__end }
    }
`

export const knowledgeGraphMetadataQuery = `
  SELECT * 
  WHERE {
    ?id a sd:Dataset ;
        dct:title ?title ;
        dct:publisher ?publisher ;
        dct:rightsHolder ?rightsHolder ;
        dct:modified ?modified ;
        dct:source ?databaseDump__id .
    ?databaseDump__id rdfs:label ?databaseDump__prefLabel ;
                      mmm-schema:data_provider_url ?databaseDump__dataProviderUrl ;
                      dct:modified ?databaseDump__modified .
  }
`
