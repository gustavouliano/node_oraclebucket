const os = require("oci-objectstorage");
const common = require("oci-common");
const readline = require('readline');
const fs = require('fs')

const provider = new common.ConfigFileAuthenticationDetailsProvider('config', 'DEFAULT');
const client = new os.ObjectStorageClient({
    authenticationDetailsProvider: provider
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    rl.question('Digite a opção (adicionar ou excluir): ', async (option) => {
        const bucketName = 'bucket';
        const namespaceName = 'grxxqdbqy9jj';
        if (option == 'adicionar') {
            rl.question('Digite o nome do arquivo: ', async (fileName) => {
                const file = fs.createReadStream(fileName);
                const stats = fs.statSync(fileName);
                const putObjectRequest = {
                    bucketName: bucketName,
                    namespaceName: namespaceName,
                    objectName: fileName,
                    putObjectBody: file,
                    contentLength: stats.size
                };
                await client.putObject(putObjectRequest);
                console.log(`Arquivo ${fileName} adicionado ao bucket.`);
                main();
            });
        }
        else if (option == 'excluir') {
            rl.question('Digite o nome do arquivo: ', async (fileName) => {
                const deleteObjectRequest = {
                    bucketName: bucketName,
                    namespaceName: namespaceName,
                    objectName: fileName
                };
                await client.deleteObject(deleteObjectRequest);
                console.log(`Arquivo ${fileName} excluído do bucket.`);
                main();
            });
        }
        else if (option == 'listar') {
            const listObjectsRequest = {
                namespaceName: namespaceName,
                bucketName: bucketName
            };
            const endpoint = 'https://objectstorage.sa-saopaulo-1.oraclecloud.com';
            const response = await client.listObjects(listObjectsRequest);
            response.listObjects.objects.forEach(async (item) => {
                console.log(`Nome do objeto: ${item.name}`);
                console.log(`URL do objeto: ${endpoint}/n/${namespaceName}/b/${bucketName}/o/${item.name}`);
            });
            main();
        }
    });
}

main();
