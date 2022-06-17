import { readFile } from 'fs/promises'
import { has } from 'lodash'
import { createBackendSearchPerspectiveConfig } from './utils/backendSearchPerspectiveConfig'
import { createBackendSearchInstanceConfig } from './utils/backendSearchInstanceConfig'

/**
 * This function get the Perspective config files (JSON) availables,
 * stored in `src/configs/${portalID}/search_perspectives/${perspectiveID}.json`
 * parsed the Object and stored into the backedSearchConfig variable
 * 
 * It also retrieve the queries files attached to the perspective and save it into the
 * object as query Blocks.
 * 
 * @returns backendSearchConfig
 */
export const createBackendSearchConfig = async () => {
  const portalConfigJSON = await readFile('src/configs/portalConfig.json')
  const portalConfig = JSON.parse(portalConfigJSON)
  const resultMappers = await import('./Mappers')
  const { portalID } = portalConfig
  // const backendSearchConfig = {}

  const { backendSearchPerspectiveConfig } = await createBackendSearchPerspectiveConfig(portalID, portalConfig.perspectives.searchPerspectives, resultMappers)
  const { backedSearchInstanceConfig } = await createBackendSearchInstanceConfig( portalID, portalConfig.perspectives.onlyInstancePages, resultMappers)

    console.log(' done da fuck')
  let backendSearchConfig = {
    ...backedSearchInstanceConfig,
    ...backendSearchPerspectiveConfig
  } 
  console.log(Object.keys(backendSearchConfig))
  return backendSearchConfig

}

export class Counter {
  dct;

  constructor (arr) {
    this.dct = {}
    this.update(arr)
  }

  mostCommon (n) {
    const lst = Object.entries(this.dct)
    lst.sort((a, b) => {
      return b[1] - a[1]
    })
    return lst.slice(0, n)
  }

  mostCommonLabels (n) {
    const lst = this.mostCommon(n)
    return lst.map(x => { return x[0] })
  }

  update (arr) {
    if (arr) {
      arr.forEach(x => this.addItem(x))
    }
  }

  combine (other) {
    for (const x of Object.keys(other.dct)) {
      if (x in this.dct) {
        this.dct[x] += other.dct[x]
      } else {
        this.dct[x] = other.dct[x]
      }
    }
  }

  addItem (x) {
    if (x in this.dct) {
      this.dct[x] += 1
    } else {
      this.dct[x] = 1
    }
  }
}
