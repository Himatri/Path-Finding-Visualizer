async function bfs(state, diagonalMovement = false){
    var visited = new Array(state.rows);
    var parent = new Array(state.rows);
    for(let i=0;i<state.rows;i++){
        visited[i] = new Array(state.cols);
        parent[i] = new Array(state.cols);
    }
    for(let i=0;i<state.rows;i++){
        for(let j=0;j<state.cols;j++){
            visited[i][j] = 0;
            parent[i][j] = [-1, -1];
        }
    }

    var q = [];     // Queue
    q.push([state.start.x, state.start.y]);
    visited[state.start.y][state.start.x] = 1;

    while(q.length){
        await state.sleep(0)
        var [x, y] = q.shift();
        visited[y][x] = 2;

        if((x === state.end.x) && (y === state.end.y)){
            break;
        }

        if(!(((x === state.start.x) && (y === state.start.y))||((x === state.end.x)&&(y === state.end.y)))){
            state.context.fillStyle = "rgb(0,255,255)";
            state.fillRect(x, y);
        }
        var neighbour = getNeighbours(state, [x, y], diagonalMovement);
        for(let i=0;i<neighbour.length;i++){
            var [nx, ny] = neighbour[i]; 
            if(state.matrix[ny][nx] === 1){
                continue;
            }

            if(visited[ny][nx] === 0){
                visited[ny][nx] = 1;
                parent[ny][nx] = [y, x];
                if(!((nx === state.end.x)&&(ny === state.end.y))){
                    state.context.fillStyle = "rgb(0,255,0,0.7)";
                    state.fillRect(nx, ny);
                }
                q.push([nx, ny]);
            }
        }
    }
    getPath(state, parent);


    // HELPERS

    function getNeighbours(state, curNode, diagonalMovement){
        var neighbours = [];
        let dx = [1,0,-1,0];
        let dy = [0,-1,0,1];
        let dx1 = [1,1,0,-1,-1,-1,0,1];
        let dy1 = [0,-1,-1,-1,0,1,1,1];
        if(diagonalMovement){ 
            for(let i=0;i<8;i++){
                let neighborX = curNode[0] + dx1[i];
                let neighborY = curNode[1] + dy1[i];
                if((neighborX>=0) && (neighborX < state.cols) && (neighborY >= 0) && (neighborY < state.rows)){
                    neighbours.push([neighborX,neighborY]);
                }
            }
        }
        else{
            for(let i=0;i<4;i++){
                let neighborX = curNode[0] + dx[i];
                let neighborY = curNode[1] + dy[i];
                if((neighborX >= 0) && (neighborX < state.cols) && (neighborY >= 0) && (neighborY < state.rows)){
                    neighbours.push([neighborX, neighborY]);
                }
            }
        }
        return neighbours;
    }



    function getPath(state, parent) {
        shortestPathLength = 0;
        curr = [state.end.y, state.end.x];
        state.context.beginPath();
        state.moveTo(curr[1], curr[0]);

        while (!(curr[0] === -1 && curr[1] === -1)) {
            curr = parent[curr[0]][curr[1]];
            if((curr[1]<0)||(curr[0]<0)){
                break;
            }
            state.lineTo(curr[1], curr[0]);
            shortestPathLength += 1;
        }
        state.context.strokeStyle="yellow";
        state.context.lineWidth = 3;
        state.context.stroke();
        console.log(shortestPathLength);
    }
}
