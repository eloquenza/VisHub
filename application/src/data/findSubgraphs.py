import json
import networkx as nx
from networkx.readwrite import json_graph
import matplotlib.pyplot as plt

edgesList = []

with open('./musae_git_data.json') as json_file:
    data = json.load(json_file)
    for edge in data['edges']:
        edgesList.append((edge['source'], edge['target']))

graph = nx.Graph(edgesList)
print(json_graph.node_link_data(graph))

f = plt.figure()
print('start drawing')
nx.draw(graph)   # default spring_layout
print('finish drawing/start saving to file')
f.savefig('graph.png')
print('finish saving to file')
