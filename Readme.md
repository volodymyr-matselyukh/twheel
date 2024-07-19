docker build --tag 'node_js' .

docker run --detach 'node_js'

docker ps

docker exec -it 4b5b003802a6 /bin/bash

# compile ts file before deployment
npx tsc ./src/index.ts

fly deploy