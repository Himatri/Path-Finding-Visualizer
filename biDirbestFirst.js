async function biDirbestFirstSearch(state, diagonalMovement = false){

    var parent1 = new Array(state.rows);
    var parent2 = new Array(state.rows);
    var closedList1 = new Array(state.rows);
    var closedList2 = new Array(state.rows);
    for(let i=0;i<state.rows;i++){
        closedList1[i]  = new Array(state.cols);
        closedList2[i]  = new Array(state.cols);
        parent1[i] = new Array(state.cols); 
        parent2[i] = new Array(state.cols); 
    }
    for(let i=0;i<state.rows;i++){
        for(let j=0;j<state.cols;j++){
            closedList1[i][j] = 0; 
            closedList2[i][j] = 0; 
            parent1[i][j] = [-1,-1];
            parent2[i][j] = [-1,-1];
        }
    }

    var foundDest = false;
    const openList1 = new PriorityQueue((a, b) => a[2] < b[2]);
    const openList2 = new PriorityQueue((a, b) => a[2] < b[2]);
    var hVal1 = heuristicVal([state.start.y, state.start.x], [state.end.y, state.end.x] , diagonalMovement, "Manhattan"); 
    openList1.push([state.start.y , state.start.x, hVal1]);
    var hVal2 = heuristicVal([state.end.y, state.end.x], [state.start.y, state.start.x] , diagonalMovement, "Manhattan"); 
    openList2.push([state.end.y , state.end.x, hVal2]);
    closedList1[state.start.y][state.start.x] = 1;
    closedList2[state.end.y][state.end.x] = 1;
    var intersect = [-1,-1];
    //parent1[state.start.y][state.start.x] = [state.start.y, state.start.x];
    //parent2[state.end.y][state.end.x] = [state.end.y, state.end.x];
    while((!openList1.isEmpty())&&(!openList2.isEmpty())){
        await state.sleep(0);
        var [y1, x1, h1] = openList1.pop();
        var [y2, x2, h2] = openList2.pop();
        
        closedList1[y1][x1] = 2;
        closedList2[y2][x2] = 2;

        if((y1 === state.end.y)&&(x1 === state.end.x)){
            foundDest = true;
            break;
        }

        if((y2 === state.start.y)&&(x2 === state.start.x)){
            foundDest = true;
            break;
        }

        if(!(((y1 === state.start.y)&&(x1 === state.start.x))||((y1 === state.end.y)&&(x1 === state.end.x)))){
            state.context.fillStyle = "rgb(0,255,255)";
            state.fillRect(x1, y1);
        }

        if(!(((y2 === state.start.y)&&(x2 === state.start.x))||((y2 === state.end.y)&&(x2 === state.end.x)))){
            state.context.fillStyle = "rgb(0,255,255)";
            state.fillRect(x2, y2);
        }

        var neighbours1 = getNeighbours(state, [y1, x1], diagonalMovement);
        var neighbours2 = getNeighbours(state, [y2,x2],diagonalMovement); 
        for(let i=0;i<neighbours1.length;i++){
            var [ny1, nx1] = neighbours1[i];
            if((closedList1[ny1][nx1] === 0)&&(state.matrix[ny1][nx1] !== 1)){
                parent1[ny1][nx1]=[y1,x1];
                var newH1 = heuristicVal([ny1, nx1], [state.end.y, state.end.x], diagonalMovement, "Manhattan"); 
                openList1.push([ny1,nx1,newH1]);
                closedList1[ny1][nx1] = 1;
                parent1[ny1][nx1] = [y1, x1];
                if(!((ny1 === state.end.y)&&(nx1 === state.end.x))){
                    state.context.fillStyle = "rgb(0,255,0,0.7)";
                    state.fillRect(nx1, ny1);
                }
            }
        }
        for(let i=0;i<neighbours2.length;i++){
            var [ny2, nx2] = neighbours2[i];
            if((closedList2[ny2][nx2] === 0)&&(state.matrix[ny2][nx2] !== 1)){
                parent2[ny2][nx2]=[y2,x2];
                var newH2 = heuristicVal([ny2, nx2], [state.start.y, state.start.x], diagonalMovement, "Manhattan"); 
                openList2.push([ny2,nx2,newH2]);
                closedList2[ny2][nx2] = 1;
                parent2[ny2][nx2] = [y2, x2];
                if(!((ny2 === state.end.y)&&(nx2 === state.end.x))){
                    state.context.fillStyle = "rgb(0,255,0,0.7)";
                    state.fillRect(nx2, ny2);
                }
            }
        }
        for(let i=0;i<state.rows;i++){
            for(let j=0;j<state.cols;j++){
                if(closedList1[i][j]&&closedList2[i][j]){
                    intersect[0] = i;
                    intersect[1] = j;
                    break;
                }
            }
            if(!((intersect[0] === -1)||(intersect[1] === -1))){
                foundDest=true;
                break;
            }
        } 
        if(!((intersect[0] === -1)||(intersect[1] === -1))){
            foundDest=true;
            break;
        }
    }
    if(foundDest){
        getPathtbest(state, intersect[1], intersect[0], parent1);
        getPathtbest(state,intersect[1],intersect[0],parent2);
    }

    // HELPERS

    function getNeighbours(state, curNode, diagonalMovement){
      var neighbours = [];
      let dx = [1,0,-1,0];
      let dy = [0,-1,0,1];
      let dx1 = [1,1,0,-1,-1,-1,0,1];
      let dy1 = [0,-1,-1,-1,0,1,1,1];
      if(diagonalMovement){ 
          for(let i=0;i<8;i++){
              let neighborX = curNode[1] + dx1[i];
              let neighborY = curNode[0] + dy1[i];
              if((neighborX>=0)&&(neighborX<state.cols)&&(neighborY>=0)&&(neighborY<state.rows)){
                  neighbours.push([neighborY,neighborX]);
              }
          }
      }
      else{
          for(let i=0;i<4;i++){
              let neighborX = curNode[1] + dx[i];
              let neighborY = curNode[0] + dy[i];
              if((neighborX>=0)&&(neighborX<state.cols)&&(neighborY>=0)&&(neighborY<state.rows)){
                  neighbours.push([neighborY,neighborX]);
              }
          }
      }
      return neighbours;
  }


  function getPathtbest(state, ex, ey, parent) {
    shortestPathLength = 0;
    curr = [ey, ex];
    state.context.beginPath();
    state.moveTo(curr[1], curr[0]);
    while (!(curr[0] === -1 && curr[1] === -1)) {
        curr = parent[curr[0]][curr[1]];
        if((curr[0]<0)||(curr[1]<0)){
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


  function heuristicVal(curNode,endNode,diagonalMovement,heuristic = "Manhattan"){
    if(heuristic === "Manhattan"){
      var hVal = Math.abs(curNode[0]-endNode[0])+Math.abs(curNode[1]-endNode[1]);
      return hVal;   
    }
    else if(heuristic === "Euclidean"){
      var a = (curNode[0]-endNode[0])*(curNode[0]-endNode[0]);
      var b = (curNode[1]-endNode[1])*(curNode[1]-endNode[1]);
      var hVal = Math.sqrt(a+b);
      return hVal;
    }
    else if(heuristic === "Octile"){
      var dx = Math.abs(curNode[0]-endNode[0]);
      var dy = Math.abs(curNode[1]-endNode[1]);
      var hVal = (dx + dy) + (Math.sqrt(2)-2)*Math.min(dx,dy);
      return hVal;
    }
    else if(heuristic === "Chebyshev"){
      var dx = Math.abs(curNode[0]-endNode[0]);
      var dy = Math.abs(curNode[1]-endNode[1]);
      var hVal = (dx + dy)-Math.min(dx,dy);
      return hVal;
    }
  }

}
