const perspectiveID = 'casualties'

export const casualtyPropertiesInstancePage = `   
  {
    ?id skos:prefLabel ?prefLabel__id .
    BIND (?prefLabel__id as ?prefLabel__prefLabel)
    BIND(?id as ?uri__id)
    BIND(?id as ?uri__dataProviderUrl)
    BIND(?id as ?uri__prefLabel)
  }
`

export const casualtyPropertiesFacetResults = `
  {
    ?id skos:prefLabel ?prefLabel__id .
    BIND (?prefLabel__id as ?prefLabel__prefLabel)
    BIND (?id AS ?prefLabel__dataProviderUrl)
    #BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    BIND(?id as ?uri__id)
    BIND(?id as ?uri__dataProviderUrl)
    BIND(?id as ?uri__prefLabel)
  }
  UNION
  {
    ?id casualties:municipality_of_domicile ?municipalityOfDomicile__id .
    ?municipalityOfDomicile__id skos:prefLabel ?municipalityOfDomicile__prefLabel .
  }
  UNION
  {
    ?id casualties:municipality_of_death ?municipalityOfDeath__id .
    ?municipalityOfDeath__id skos:prefLabel ?municipalityOfDeath__prefLabel .
  }
  UNION
  {
    ?id casualties:rank ?rank__id .
    ?rank__id skos:prefLabel ?rank__prefLabel .
  }
  UNION
  {
    ?id warsa:date_of_death ?deathTimeTimespan__id .
    BIND (STR(?deathTimeTimespan__id) AS ?deathTimeTimespan__prefLabel) .
  }
  UNION
  {
    ?id bioc:has_occupation ?occupation__id .
    ?occupation__id skos:prefLabel ?occupation__prefLabel .
    FILTER (LANG(?occupation__prefLabel) = 'fi')
  }
  UNION
  {
    ?id warsa:gender ?gender__id .
    ?gender__id skos:prefLabel ?gender__prefLabel .
  }
  UNION
  {
    ?id warsa:mother_tongue ?motherTongue__id .
    ?motherTongue__id skos:prefLabel ?motherTongue__prefLabel .
  }
  UNION
  {
    ?id warsa:marital_status ?maritalStatus__id .
    ?maritalStatus__id skos:prefLabel ?maritalStatus__prefLabel .
  }
  UNION
  {
    ?id casualties:perishing_category ?perishingCategory__id .
    ?perishingCategory__id skos:prefLabel ?perishingCategory__prefLabel .
  }
  UNION
  {
    ?id casualties:unit ?unit__id .
    ?unit__id skos:prefLabel ?unit__prefLabel .
  }
`

export const deathsByHisclassQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?record) AS ?instanceCount)
  WHERE {
  <FILTER>
    ?record a warsa:DeathRecord ;
      bioc:has_occupation ?occupation .
    ?occupation ammo:hisclass5 ?class .
    ?class skos:altLabel ?hisclass .
    BIND(
      IF(?occupation = <http://ldf.fi/ammo/tyomies>, 5,
        IF(?occupation = <http://ldf.fi/ammo/sekatyomies>, 5, xsd:integer(?hisclass)))
      AS ?prefLabel)
      BIND(
        IF(?occupation = <http://ldf.fi/ammo/tyomies>, <http://ldf.fi/ammo/hisco/hisclass5/5> ,
          IF(?occupation = <http://ldf.fi/ammo/sekatyomies>, <http://ldf.fi/ammo/hisco/hisclass5/5> , ?class))
        AS ?category)
    FILTER (?prefLabel != '-1')
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const deathsByMonthQuery = `
    SELECT ?category ?prefLabel (COUNT(DISTINCT ?record) AS ?instanceCount)
    WHERE {
    <FILTER>
    ?record a warsa:DeathRecord .
    ?record warsa:date_of_death ?date_of_death .
    BIND(SUBSTR(str(?date_of_death),1,7) AS ?category)
    BIND(CONCAT(?category, ' ') AS ?prefLabel)
    FILTER (?date_of_death > "1939-05-01"^^xsd:date)
    FILTER (?date_of_death < "1945-05-01"^^xsd:date)
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const deathsByPerishingCategoryQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?record) AS ?instanceCount)
  WHERE {
    <FILTER>
    ?record a warsa:DeathRecord .
    ?record casualties:perishing_category ?category .
    ?category skos:prefLabel ?prefLabel .
    FILTER (LANG(?prefLabel) = 'fi')
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const deathsByRankQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?record) AS ?instanceCount)
  WHERE {
    <FILTER>
    ?record a warsa:DeathRecord .
    ?category a warsa:Rank .
    FILTER (?category = <http://ldf.fi/warsa/actors/ranks/Upseeri> || ?category = <http://ldf.fi/warsa/actors/ranks/Aliupseeri> || ?category = <http://ldf.fi/warsa/actors/ranks/Miehistoe>)
    ?record casualties:rank/dct:isPartOf+ ?category .
    ?category skos:prefLabel ?prefLabel .
    FILTER (LANG(?prefLabel) = 'fi')
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const deathsByMotherTongueQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?record) AS ?instanceCount)
  WHERE {
    <FILTER>
    ?record a warsa:DeathRecord .
    ?record warsa:mother_tongue ?category .
    ?category skos:prefLabel ?prefLabel .
    FILTER (LANG(?prefLabel) = 'fi')
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const deathsByMaritalStatusQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?record) AS ?instanceCount)
  WHERE {
    <FILTER>
    ?record a warsa:DeathRecord .
    ?record warsa:marital_status ?category .
    ?category skos:prefLabel ?prefLabel .
    FILTER (LANG(?prefLabel) = 'fi')
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const deathsByGenderQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?record) AS ?instanceCount)
  WHERE {
    <FILTER>
    ?record a warsa:DeathRecord .
    ?record warsa:gender ?category .
    ?category skos:prefLabel ?prefLabel .
    FILTER (LANG(?prefLabel) = 'fi')
  }
  GROUP BY ?category ?prefLabel
  ORDER BY ASC(?prefLabel)
`

export const deathsByNumberOfChildrenQuery = `
  SELECT ?category
  (COUNT(DISTINCT ?record) as ?count)
  WHERE {
    <FILTER>
    ?record warsa:number_of_children ?category .
    # BIND(xsd:integer(ROUND(?decimal_value)) as ?category)
  }
  GROUP BY ?category
  ORDER BY ?category
`

export const deathsByAgeQuery = `
  SELECT ?category
  (COUNT(DISTINCT ?record) as ?count)
  WHERE {
    <FILTER>
    ?record warsa:date_of_birth ?birthDate .
    ?record warsa:date_of_death ?deathDate .
    BIND(xsd:integer(FLOOR(DAY(?deathDate - ?birthDate) / 365)) as ?category)
    FILTER(BOUND(?category))
    FILTER(?category < 120)
  }
  GROUP BY ?category
  ORDER BY ?category
`

export const deathsByLineMonthQuery = `
  SELECT ?category (COUNT(DISTINCT ?record) AS ?count)
  WHERE {
    <FILTER>
    ?record a warsa:DeathRecord .
    ?record warsa:date_of_death ?date_of_death .
    BIND(SUBSTR(str(?date_of_death),1,7) AS ?category)
    FILTER (?date_of_death > "1939-05-01"^^xsd:date)
    FILTER (?date_of_death < "1945-05-01"^^xsd:date)
  }
  GROUP BY ?category
  ORDER BY ASC(?category)
  `

export const deathsByPopulationQuery = `
  SELECT ?id ?prefLabel ?polygon ?population (COUNT(DISTINCT ?record)/?population*100 as ?instanceCount)
  WHERE {
    <FILTER>
    ?record casualties:municipality_of_domicile/casualties:preferred_municipality ?id ;
        a warsa:DeathRecord .
    ?id a <http://www.yso.fi/onto/suo/kunta> ;
          skos:prefLabel ?prefLabel ;
        sch:polygon ?polygon .
    ?place skos:closeMatch ?id .
    ?place warsa-a:population ?pop .
    BIND (xsd:integer(?pop) AS ?population)
  }
  GROUP BY ?id ?prefLabel ?polygon ?population
  ORDER BY desc(?instanceCount)
`

export const deathsByMunicipalityOfDomicileQuery = `
  SELECT DISTINCT ?id ?prefLabel ?polygon (count(DISTINCT ?record) as ?instanceCount)
  WHERE {
    {
      ?id a <http://www.yso.fi/onto/suo/kunta> ;
          skos:prefLabel ?prefLabel ;
          sch:polygon ?polygon .
    }
    UNION {
      <FILTER>
      ?record casualties:municipality_of_domicile/casualties:preferred_municipality ?id ;
          a warsa:DeathRecord .
      ?id a <http://www.yso.fi/onto/suo/kunta> ;
          skos:prefLabel ?prefLabel ;
          sch:polygon ?polygon .
    }
  }
  GROUP BY ?id ?prefLabel ?polygon
  ORDER BY desc(?instanceCount)
`

export const deathsByOfficerRatioQuery = `
SELECT ?category (COUNT(DISTINCT ?filteredRecord)/COUNT(DISTINCT ?record) AS ?count) (COUNT(DISTINCT ?record) AS ?allRecords)
WHERE {
  {
    <FILTER>
    ?record a warsa:DeathRecord .
      ?record warsa:date_of_death ?date_of_death .
      BIND(SUBSTR(str(?date_of_death),1,7) AS ?category)
      FILTER (?date_of_death > "1939-05-01"^^xsd:date)
      FILTER (?date_of_death < "1945-05-01"^^xsd:date)
  }
  UNION {
    <FILTER>
    ?record a warsa:DeathRecord .
    BIND(?record AS ?filteredRecord)
    ?record <http://ldf.fi/schema/warsa/casualties/rank> ?rank .
    ?rank dct:isPartOf* <http://ldf.fi/warsa/actors/ranks/Upseeri> .
    ?record warsa:date_of_death ?date_of_death .
    BIND(SUBSTR(str(?date_of_death),1,7) AS ?category)
    FILTER (?date_of_death > "1939-05-01"^^xsd:date)
    FILTER (?date_of_death < "1945-05-01"^^xsd:date)
  }
}
GROUP BY ?category
ORDER BY asc(?category)
`

export const deathsByRatioFromOfficersQuery = `
SELECT ?category (COUNT(DISTINCT ?record)/COUNT(DISTINCT ?filteredRecord) AS ?count) (COUNT(DISTINCT ?record) AS ?allRecords)
WHERE {
  {
    <FILTER>
    ?record a warsa:DeathRecord .
    ?record <http://ldf.fi/schema/warsa/casualties/rank> ?rank .
    ?rank dct:isPartOf* <http://ldf.fi/warsa/actors/ranks/Upseeri> .
      ?record warsa:date_of_death ?date_of_death .
      BIND(SUBSTR(str(?date_of_death),1,7) AS ?category)
      FILTER (?date_of_death > "1939-05-01"^^xsd:date)
      FILTER (?date_of_death < "1945-05-01"^^xsd:date)
  }
  UNION {
    ?filteredRecord a warsa:DeathRecord .
    ?filteredRecord <http://ldf.fi/schema/warsa/casualties/rank> ?rank .
    ?rank dct:isPartOf* <http://ldf.fi/warsa/actors/ranks/Upseeri> .
    ?filteredRecord warsa:date_of_death ?date_of_death .
    BIND(SUBSTR(str(?date_of_death),1,7) AS ?category)
    FILTER (?date_of_death > "1939-05-01"^^xsd:date)
    FILTER (?date_of_death < "1945-05-01"^^xsd:date)
  }
}
GROUP BY ?category
HAVING (?count > 0)
ORDER BY asc(?category)
`

// Compare filtered group to all
export const deathsByRatioToAllQuery = `
SELECT ?category (COUNT(DISTINCT ?filteredRecord)/COUNT(DISTINCT ?record) AS ?count) (COUNT(DISTINCT ?record) AS ?allRecords)
WHERE {
  {
    ?record a warsa:DeathRecord .
      ?record warsa:date_of_death ?date_of_death .
      BIND(SUBSTR(str(?date_of_death),1,7) AS ?category)
      FILTER (?date_of_death > "1939-05-01"^^xsd:date)
      FILTER (?date_of_death < "1945-05-01"^^xsd:date)
  }
  UNION {
    <FILTER>
    ?record a warsa:DeathRecord .
    BIND(?record AS ?filteredRecord)
    ?record warsa:date_of_death ?date_of_death .
    BIND(SUBSTR(str(?date_of_death),1,7) AS ?category)
    FILTER (?date_of_death > "1939-05-01"^^xsd:date)
    FILTER (?date_of_death < "1945-05-01"^^xsd:date)
  }
}
GROUP BY ?category
ORDER BY asc(?category)
`

export const deathsByProvinceOfDomicileQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?record) AS ?instanceCount)
  WHERE {
    <FILTER>
    ?record a warsa:DeathRecord .
    ?record casualties:municipality_of_domicile/casualties:preferred_municipality/geos:sfWithin+ ?category .
    ?category skos:prefLabel ?prefLabel .
    ?category a <http://www.yso.fi/onto/suo/laani> .
    FILTER (LANG(?prefLabel) = 'fi')
  }
  GROUP BY ?category ?prefLabel
  ORDER BY desc(?instanceCount)
`

export const deathsByProvinceOfDomicileRatioQuery = `
  SELECT ?category (COUNT(DISTINCT ?filteredRecord)/COUNT(DISTINCT ?record) AS ?count) (COUNT(DISTINCT ?record) AS ?allRecords)
  WHERE {
    {
      <FILTER>
      ?record a warsa:DeathRecord .
      ?record casualties:municipality_of_domicile/casualties:preferred_municipality/geos:sfWithin+ ?province .
      ?province skos:prefLabel ?prefLabel .
      ?province a <http://www.yso.fi/onto/suo/laani> . # This limits counting to places with hierarchy with lääni. The numbers won't be exactly accccurate.
      FILTER (LANG(?prefLabel) = 'fi')
      ?record warsa:date_of_death ?date_of_death .
      BIND(SUBSTR(str(?date_of_death),1,7) AS ?category)
      FILTER (?date_of_death > "1939-05-01"^^xsd:date)
      FILTER (?date_of_death < "1945-05-01"^^xsd:date)
    }
    UNION
    {
      <FILTER>
      ?record a warsa:DeathRecord .
      BIND(?record AS ?filteredRecord)
      ?record casualties:municipality_of_domicile/casualties:preferred_municipality/geos:sfWithin+ ?province .
      ?province skos:prefLabel ?prefLabel .
      ?province a <http://www.yso.fi/onto/suo/laani> .
      FILTER (?prefLabel = "Viipurin lääni"@fi)  # This needs to be changed manually from the query
      ?filteredRecord warsa:date_of_death ?date_of_death .
      BIND(SUBSTR(str(?date_of_death),1,7) AS ?category)
      FILTER (?date_of_death > "1939-05-01"^^xsd:date)
      FILTER (?date_of_death < "1945-05-01"^^xsd:date)
    }
  }
  GROUP BY ?category
  HAVING (?allRecords > 10)
  ORDER BY ASC(?category)
`

export const ageAverageQuery = `
SELECT DISTINCT ?category (ROUND(AVG(?age)) AS ?count)
WHERE {
  <FILTER>
  ?record a warsa:DeathRecord .
  ?record warsa:date_of_death ?deathDate .
  BIND(SUBSTR(str(?deathDate),1,7) AS ?category)
  FILTER (?deathDate > "1939-05-01"^^xsd:date)
  FILTER (?deathDate < "1945-05-01"^^xsd:date)
  ?record warsa:date_of_birth ?birthDate .
  BIND(xsd:integer(FLOOR(DAY(?deathDate - ?birthDate) / 365)) as ?age)
  FILTER(BOUND(?age))
  FILTER(?age < 120)
}
GROUP BY ?category
ORDER BY ASC(?category)
`

export const deathsToPopulationPercentageByProvinceQuery = `
SELECT DISTINCT ?category ?prefLabel (COUNT(DISTINCT ?record)/SUM(DISTINCT ?population)*10000 AS ?instanceCount)
  WHERE {
    <FILTER>
    ?record a warsa:DeathRecord .
    ?record casualties:municipality_of_domicile/casualties:preferred_municipality ?municipality .
    ?municipality geos:sfWithin+ ?category .
    ?category skos:prefLabel ?prefLabel .
    ?category a <http://www.yso.fi/onto/suo/laani> .
    FILTER (LANG(?prefLabel) = 'fi')
    ?place skos:closeMatch ?municipality .
     ?place warsa-a:population ?pop .
    BIND (xsd:integer(?pop) AS ?population)
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?prefLabel)
`