export class TextService {
    async load(id: string): Promise<string> {
        const response = await fetch("https://swarm-gateways.net/bzz-raw:/" + id);
        return await response.text();
    }

    async save(text: string): Promise<string> {
        const response = await fetch("https://swarm-gateways.net/bzz-raw:/", {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: text
        });
    
        return await response.text();
    }
}