import {hash} from 'utils/hashing'

function generateReactKey(collection: any, index: number): string {
  const collectionName = collection.name
  return hash(collectionName + index).toString()
}

export default generateReactKey
