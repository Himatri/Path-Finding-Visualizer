async function bidirDijkstra(state, diagonalMovement = false){
    let maxi = Number.MAX_SAFE_INTEGER;
    var closedList1 = new Array(state.rows);
    var closedList2 = new Array(state.rows);
    var cellDetails1 = new Array(state.rows);
    var cellDetails2 = new Array(state.rows);
    for(let i=0;i<state.rows;i++){
        closedList1[i]  = new Array(state.cols);
        closedList2[i]  = new Array(state.cols);
        cellDetails1[i] = new Array(state.cols);
        cellDetails2[i] = new Array(state.cols); 
    }
    for(let i=0;i<state.rows;i++){
        for(let j=0;j<state.cols;j++){
            closedList1[i][j] = 0;
            closedList2[i][j] = 0;
            cellDetails1[i][j] = [maxi,maxi,0.0,-1,-1];
            cellDetails2[i][j] = [maxi,maxi,0.0,-1,-1];
        }
    }

    cellDetails1[state.start.y][state.start.x] = [0.0, 0.0, 0.0, state.start.y, state.start.x];
    cellDetails2[state.end.y][state.end.x] = [0.0, 0.0, 0.0, state.end.y, state.end.x];
    const openList1 = new PriorityQueue((a, b) => a[2] < b[2]);
    const openList2 = new PriorityQueue((a, b) => a[2] < b[2]);
    openList1.push([state.start.y, state.start.x, 0.0]);
    openList2.push([state.end.y, state.end.x, 0.0]);
    var foundDest = false;
    var intersect = [-1,-1];

    while((!openList1.isEmpty())&&(!openList2.isEmpty())){
        await state.sleep(0);
        var [y1, x1, cost1] = openList1.pop();
        var [y2, x2, cost2] = openList2.pop();
        
        closedList1[y1][x1] = 1;
        closedList2[y2][x2] = 1;

        if(!(((y1 === state.start.y)&&(x1 === state.start.x))||((y1 === state.end.y)&&(x1 === state.end.x)))){
            state.context.fillStyle = "rgb(0,255,255)";
            state.fillRect(x1, y1);
        }

        if(!(((y2 === state.start.y)&&(x2 === state.start.x))||((y2 === state.end.y)&&(x2 === state.end.x)))){
            state.context.fillStyle = "rgb(0,255,255)";
            state.fillRect(x2, y2);
        }

        var neighbour1 = getNeighbours(state, [y1, x1], diagonalMovement);
        var neighbour2 = getNeighbours(state, [y2, x2], diagonalMovement);

        for(let i=0;i<neighbour1.length;i++){
            var [ny1, nx1] = neighbour1[i];
            var cell1 = cellDetails1[ny1][nx1]; 
            if((ny1 === state.end.y)&&(nx1 === state.end.x)){
                cellDetails1[ny1][nx1] = [cell1[0], cell1[1], cell1[2], y1, x1];
                intersect = [state.end.y , state.end.x]; 
                foundDest = true;
                break;
            }
            else if((closedList1[ny1][nx1] === 0) && (state.matrix[ny1][nx1] !== 1)){
                let gNew1 = cellDetails1[y1][x1][1] + 1.0;
                let hNew1 = 0.0;
                let fNew1 = gNew1 + hNew1;
                
                if((cell1[0] === maxi)||(cell1[0]>fNew1)){
                    openList1.push([ny1, nx1, fNew1]);
                    cellDetails1[ny1][nx1] = [fNew1, gNew1, hNew1, y1, x1];
                    if(!((ny1 === state.end.y)&&(nx1 === state.end.x))){
                        state.context.fillStyle = "rgb(0,255,0,0.7)";
                        state.fillRect(nx1, ny1);
                    }
                }
            }
        }
        for(let i=0;i<neighbour2.length;i++){
            var [ny2, nx2] = neighbour2[i];
            var cell2 = cellDetails2[ny2][nx2]; 
            if((ny2 === state.start.y)&&(nx2 === state.start.x)){
                cellDetails2[ny2][nx2] = [cell2[0], cell2[1], cell2[2], y2, x2];
                intersect = [state.start.y,state.start.x];
                foundDest = true;
                break;
            }
            else if((closedList2[ny2][nx2] === 0) && (state.matrix[ny2][nx2] !== 1)){
                let gNew2 = cellDetails2[y2][x2][1] + 1.0;
                let hNew2 = 0.0;
                let fNew2 = gNew2 + hNew2;
                
                if((cell2[0] === maxi)||(cell2[0]>fNew2)){
                    openList2.push([ny2, nx2, fNew2]);
                    cellDetails2[ny2][nx2] = [fNew2, gNew2, hNew2, y2, x2];
                    if(!((ny2 === state.start.y)&&(nx2 === state.start.x))){
                        state.context.fillStyle = "rgb(0,255,0,0.7)";
                        state.fillRect(nx2, ny2);
                    }
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
        getPathbdbest(state, cellDetails1,intersect);
        getPathbdbest(state,cellDetails2,intersect);
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


  function getPathbdbest(state, cellDetails,intersect){
      let row = intersect[0]; 
      let col = intersect[1];
      var cell = cellDetails[row][col]; 
      state.context.beginPath();
      state.moveTo(col, row);
      while(!((cell[3] === row) && (cell[4] === col))){
           row = cell[3];
           col = cell[4];
           cell = cellDetails[row][col];
           state.lineTo(col, row);
      }
      state.context.strokeStyle = "yellow";
      state.context.lineWidth = 3;
      state.context.stroke();
  }





  function heuristicVal(curNode, endNode, diagonalMovement, heuristic = "Manhattan"){
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
