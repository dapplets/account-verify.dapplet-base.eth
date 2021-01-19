export class TextService {
    async load(id: string): Promise<string> {
        const response = await fetch("https://gateway.ethswarm.org/files/" + id);
        return await response.text();
    }

    async save(text: string): Promise<string> {
        const response = await fetch("https://gateway.ethswarm.org/files", {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: text
        });
    
        const result = await response.json();
        return result.reference;
    }
}