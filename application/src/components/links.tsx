import React from 'react'
import * as d3 from 'd3'
import {d3Types} from 'typedecls'

interface LinksProps {
  links: d3Types.SimulationLink[]
}

interface SingleLinkProps {
  link: d3Types.SimulationLink
}

class Link extends React.Component<SingleLinkProps, {}> {
  readonly ref: React.RefObject<SVGLineElement> = React.createRef()

  componentDidMount() {
    d3.select(this.ref.current)
      .data([this.props.link])
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
  }

  render() {
    return <line className="link" ref={this.ref} />
  }
}

function Links({links}: LinksProps) {
  const linkComponents = links.map(
    (link: d3Types.SimulationLink, index: number) => (
      <Link key={index} link={link} />
    )
  )

  return <g className="links">{linkComponents}</g>
}

export default Links
