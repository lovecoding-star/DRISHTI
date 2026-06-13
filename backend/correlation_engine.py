import networkx as nx


def build_graph(centres: list, alerts: list) -> dict:
    graph = nx.Graph()
    for centre in centres:
        code = centre.get("centre_code")
        graph.add_node(code, label=centre.get("centre_name"), group=centre.get("risk_level", "LOW"), level=centre.get("risk_level", "LOW"))
    for alert in alerts:
        alert_id = f"alert-{alert.get('id')}"
        graph.add_node(alert_id, label=alert.get("threat_level"), group="ALERT", level=alert.get("threat_level"))
        state = alert.get("channel_name", "Unknown")
        graph.add_edge(alert_id, state, relation="reported_in")
    for centre in centres:
        for other in centres:
            if centre["state"] == other["state"] and centre["centre_code"] != other["centre_code"]:
                if abs(centre["above_600_pct"] - other["above_600_pct"]) < 0.75:
                    graph.add_edge(centre["centre_code"], other["centre_code"], relation="state_similarity")
    nodes = []
    links = []
    for node, data in graph.nodes(data=True):
        nodes.append({"id": node, "label": data.get("label"), "group": data.get("group"), "risk_level": data.get("level")})
    for source, target, data in graph.edges(data=True):
        links.append({"source": source, "target": target, "relation": data.get("relation")})
    return {"nodes": nodes, "links": links}
