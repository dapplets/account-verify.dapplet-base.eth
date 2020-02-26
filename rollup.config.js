import typescript from '@rollup/plugin-typescript';
import image from '@rollup/plugin-image';
import serve from 'rollup-plugin-serve';
import fs from 'fs';

export default [{
    input: 'src/index.ts',
    output: [{
        file: 'lib/index.js',
        format: 'cjs',
        exports: 'named'
    }],
    plugins: [typescript(), image(), serve({
        https: {
            key: fs.readFileSync('./secret/server.key'),
            cert: fs.readFileSync('./secret/server.cert'),
            //ca: fs.readFileSync('/path/to/ca.pem')
        },
        contentBase: ''
    })]
}];