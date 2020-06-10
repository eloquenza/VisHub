export namespace d3Types {
  export class d3Node implements d3.SimulationNodeDatum {
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;

    id?: string;
    group?: number;

    constructor(id: string, group: number) {
        this.id = id;
        this.group = group;
    }
  };

  export class d3Link implements d3.SimulationLinkDatum<d3Node> {
    // optional - defining optional implementation properties - required for relevant typing assistance
    index?: number;

    // must - defining enforced implementation properties
    source: d3Node | string | number;
    target: d3Node | string | number;

    value: number;

    constructor(source: string | number | d3Node, target: string | number | d3Node, value: number) {
      this.source = source;
      this.target = target;
      this.value = value;
    }
  };

  export type d3Graph = {
    nodes: d3Node[],
    links: d3Link[]
  };
}
