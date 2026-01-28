import fs, { readdirSync } from 'fs';
import path from 'path';
import buble from '@rollup/plugin-buble';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import styles from "rollup-plugin-styles";
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const { dependencies } = require('./package.json');

const name = 'clippy'
const dist = path.resolve(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
}

const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

// prepare agent configs
const agentDir = path.resolve(__dirname, 'src/agents');

const agentInputs = getDirectories(agentDir).map(agent => {
    return {
        [`agents/${agent}`]: `${agentDir}/${agent}/index.ts`, 
    }
}).reduce((acc, cur) => {
    return {...acc, ...cur}
}, {});

console.log(agentInputs)

module.exports = [{
    strictDeprecations: true,
    input: {
        index: 'src/index.ts',
        ...agentInputs
    },
    external: Object.keys(dependencies || {}),
    plugins: [
        typescript(),
        styles(),
        buble(),
        nodeResolve({
            browser: true,
        }),
        image({
            dom: false,
            include: /\.(png|jpg)$/,
        }),
        commonjs(),
        terser(),
    ],
    output: [
        {
            dir: dist,
            format: 'es',
            sourcemap: true,
        },
    ]
},
];
