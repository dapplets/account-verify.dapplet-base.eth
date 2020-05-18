import typescript from '@rollup/plugin-typescript';
import image from '@rollup/plugin-image';
import serve from 'rollup-plugin-serve';
import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const showAddress = () => ({ 
    load: () => console.log('\x1b[35m%s\x1b[0m', `Current registry address: https://localhost:10001/dapplets.json`) 
});

export default [{
    input: 'src/index.ts',
    output: [{
        file: 'lib/index.js',
        format: 'cjs',
        exports: 'named'
    }],
    plugins: [
        typescript(), 
        resolve({ browser: true }),
        commonjs(),
        image(), 
        serve({
            https: {
                key: fs.readFileSync('./secret/server.key'),
                cert: fs.readFileSync('./secret/server.cert'),
                //ca: fs.readFileSync('/path/to/ca.pem')
            },
            contentBase: ''
        }),
        showAddress()
    ]
}];