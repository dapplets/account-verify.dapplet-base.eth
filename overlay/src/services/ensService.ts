import * as ethers from 'ethers';

export class EnsService {
    async getDomains(address: string): Promise<string[]> {
        const body = {
            operationName: "getRegistrations",
            variables: {
                id: address.toLowerCase(),
                orderBy: "expiryDate",
                orderDirection: "asc"
            },
            query: "query getRegistrations($id: ID!, $first: Int, $skip: Int, $orderBy: Registration_orderBy, $orderDirection: OrderDirection) { account(id: $id) { registrations(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) { expiryDate domain { labelName labelhash name isMigrated parent { name }}}}}"
        };
        const response = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby', { method: 'POST', body: JSON.stringify(body) });
        const json = await response.json();
        return json.data?.account?.registrations?.map((x: any) => x.domain?.name?.toLowerCase()) || [];
    }

    async getRegistrant(domain: string): Promise<string> {
        // ToDo: which characters are valid?
        // ToDo: UTS46 and nameprep
        const name = (domain.lastIndexOf('.eth') === domain.length - 4) ? domain.substr(0, domain.length - 4) : domain;
        const id = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name.toLowerCase()));

        const body = {
            operationName: "getRegistrantFromSubgraph",
            variables: {
                "id": id
            },
            "query": "query getRegistrantFromSubgraph($id: ID!) { registration(id: $id) { id domain { name __typename } registrant { id __typename } __typename } } "
        };
        const response = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby', { method: 'POST', body: JSON.stringify(body) });
        const json = await response.json();
        return json.data?.registration?.registrant?.id;
    }
}