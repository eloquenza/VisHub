import {hash} from 'utils/hashing'

function generateReactKey(collection: string, index: number): string {
  return hash(collection + index).toString()
}

export default generateReactKey
