import {
  Graph,
  Edge,
  EdgeBundlingNode,
  EdgeBundlingEdge,
  vertexWithAllDecendants,
} from 'typedecls/D3Types'

export type Group = {
  id: number
  children?: vertexWithAllDecendants[]
}

export type Tree = {
  children: Group[]
}

export function transformGraphIntoTree({vertices, edges}: Graph): any {
  const groupById = new Map()
  const vertexById = new Map(
    vertices.map(vertex => [vertex.id, vertex as vertexWithAllDecendants])
  )

  vertexById.forEach((vertex: vertexWithAllDecendants) => {
    let group = groupById.get(vertex.group)
    if (!group) {
      groupById.set(
        vertex.group,
        (group = {
          id: vertex.group,
          children: [],
        })
      )
    }
    group.children.push(vertex)
    vertex.targets = []
  })

  edges.forEach(({source, target}: Edge) => {
    if (typeof source === 'string' && typeof target === 'string') {
      vertexById.get(source)?.targets.push(target)
    }
  })

  return {children: [...groupById.values()]}
}

export function bilinks(root: EdgeBundlingNode) {
  const leaves = root.leaves()
  const map = new Map(leaves.map(d => [d.data.id, d]))

  root.leaves().forEach(node => {
    node.incoming = []
    node.outgoing = []
    node.data.targets.map(targetString => {
      const targetNode = map.get(targetString)
      if (typeof targetNode !== 'undefined') {
        const newEdge: EdgeBundlingEdge = {
          source: node,
          target: targetNode,
          // hacky but no other way to create a SVGPathElement
          // currently really asking myself why typescript even exists
          // if, for some types, there is no way to instantiate them
          svgPath: Object.create(SVGPathElement.prototype, {}),
        }
        node.outgoing.push(newEdge)
      }
    })
  })

  root.leaves().forEach(node => {
    node.outgoing.map(outgoingEdge => {
      outgoingEdge.target.incoming.push(outgoingEdge)
    })
  })

  return root
}
