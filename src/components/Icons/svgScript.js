console.log('hello');
const fs = require('fs');
function snakeToCamel(s) {
    return s.replace(/(-\w)/g, function (m) {
        return m[1].toUpperCase();
    });
}

function generateScript(fileName, width, height, content) {
    return `import { Path, Svg } from 'react-native-svg';
    import React from 'react';
    import { useTheme } from 'native-base';

    export default function ${fileName}({
      color,
      size,
      width = '${width}',
      height = '${height}'
    }) {
      const theme = useTheme();
      const currentColor = color ? color : theme.colors.darkText;
      return (
       <Svg
          width={width}
          height={height}
          viewBox="0 0 ${width} ${height}"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          ${content}
        </Svg>
      );
    }
    `;
}

function main() {
    // loop through all svg files in the folder and create a script for each one
    const files = fs.readdirSync('./src/components/Icons').filter((file) => file.endsWith('.svg'));
    files.forEach((file) => {
        //Camel case the file name
        let fileName = snakeToCamel(file.replace('.svg', ''));
        fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

        //Read the file
        const fileContent = fs.readFileSync(`./src/components/Icons/${file}`, 'utf8');
        const width = fileContent.match(/width="(\d+)"/)[1];
        const height = fileContent.match(/height="(\d+)"/)[1];
        let insideSvg = fileContent.match(/<svg.*?>(.*)<\/svg>/s)[1];
        //replace path with Path
        insideSvg = insideSvg.replace(/<path/g, '<Path');
        //replace stroke-linecap with strokeLinecap
        insideSvg = insideSvg.replace(/stroke-linecap/g, 'strokeLinecap');
        //replace stroke-linejoin with strokeLinejoin
        insideSvg = insideSvg.replace(/stroke-linejoin/g, 'strokeLinejoin');
        //replace stroke-width with strokeWidth
        insideSvg = insideSvg.replace(/stroke-width/g, 'strokeWidth');
        // find all position start with # and 6 characters after
        // const color = insideSvg.match(/#.{6}/g)[0];
        // // replace all matches with theme.colors
        // insideSvg = insideSvg.replace(/"#.{6}"/g, '{currentColor}');

        // generate the script
        const script = generateScript(fileName, width, height, insideSvg);
        // write the script to the file
        fs.writeFileSync(`./src/components/Icons/${fileName}.js`, script, 'utf8');
        // delete the svg file
        fs.unlinkSync(`./src/components/Icons/${file}`);
    });
    // create a script for each svg file
    // create a script for each svg file
}

main();
