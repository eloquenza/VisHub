import json
import networkx as nx
import networkx.algorithms.community as comalgos
from networkx.readwrite import json_graph

edgesList = []
verticesList = []

with open('./musae_git_data.json') as json_file:
    data = json.load(json_file)
    for edge in data['edges']:
        edgesList.append((edge['source'], edge['target']))
    for node in data['vertices']:
        verticesList.append(node['name'])

graph = nx.Graph(edgesList)
for i, node in enumerate(verticesList):
    graph.nodes[i]['name'] = verticesList[i]

# print("Max CLIQUE number: {}".format(nx.graph_clique_number(graph)))
# print("Amount of CLIQUES: {}".format(nx.graph_number_of_cliques(graph)))

# k_clique_communities = list(comalgos.k_clique_communities(graph, 8))
# print(k_clique_communities)

from random import sample
random_nodes = sample(list(graph.nodes()), 36000)
graph.remove_nodes_from(random_nodes)

isolates = list(nx.isolates(graph))
graph.remove_nodes_from(isolates)

node_link = json_graph.node_link_data(graph, dict(source='source', target='target', name='id', key='key', link='edges'))
adjacency_data = json_graph.adjacency_data(graph)

with open('node_link_data.json', 'w') as outfile:
    json.dump(node_link, outfile, indent=4)

with open('adjacency_data.json', 'w') as outfile:
    json.dump(adjacency_data, outfile, indent=4)
