const fs = require('fs');
const distDir = './dist';
if (!fs.existsSync(distDir)){
    fs.mkdirSync(distDir);
}

const html = `
<html>
<head><title>CI/CD Demo</title></head>
<body>
<h1>Deployment Success!</h1>
<p>This site was built by Jenkins and deployed to S3.</p>
</body>
</html>
`;

fs.writeFileSync(`${distDir}/index.html`, html);
console.log('Node.js static site generated in dist/');
