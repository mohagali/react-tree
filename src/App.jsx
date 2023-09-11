import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { ThemeProvider, CssBaseline, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  Tree,
  MultiBackend,
  getDescendants,
  getBackendOptions
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import { AddDialog } from "./AddDialog";
import { Preview } from "./Preview";
import { theme } from "./theme";
import styles from "./App.module.css";
import SampleData from "./sample_data.json";
import { Placeholder } from "./Placeholder";

const getLastId = (treeData) => {
  const reversedArray = [...treeData].sort((a, b) => {
    if (a.id < b.id) {
      return 1;
    } else if (a.id > b.id) {
      return -1;
    }

    return 0;
  });

  if (reversedArray.length > 0) {
    return reversedArray[0].id;
  }

  return 0;
};

function App() {
  const [treeData, setTreeData] = useState(SampleData);
  const handleDrop = (newTree) => setTreeData(newTree);
  const [open, setOpen] = useState(false);

  const handleDelete = (id) => {
    const deleteIds = [
      id,
      ...getDescendants(treeData, id).map((node) => node.id)
    ];
    const newTree = treeData.filter((node) => !deleteIds.includes(node.id));

    setTreeData(newTree);
  };
  const handleNewFolder = ({ text, parent }) => {
    const newNode = {
      text,
      parent,
      droppable: true
    };

    const lastId = getLastId(treeData) + 1;

    setTreeData([
      ...treeData,
      {
        ...newNode,
        id: lastId
      }
    ]);
  };
  const handleNewFile = ({ text, parent }) => {
    const newNode = {
      text,
      parent,
      droppable: false,
      data: {
        fileType: "text"
      }
    };

    const lastId = getLastId(treeData) + 1;

    setTreeData([
      ...treeData,
      {
        ...newNode,
        id: lastId
      }
    ]);
  };
  const handleCopy = (id) => {
    const lastId = getLastId(treeData);
    const targetNode = treeData.find((n) => n.id === id);
    const descendants = getDescendants(treeData, id);
    const partialTree = descendants.map((node) => ({
      ...node,
      id: node.id + lastId,
      parent: node.parent + lastId
    }));

    setTreeData([
      ...treeData,
      {
        ...targetNode,
        id: targetNode.id + lastId
      },
      ...partialTree
    ]);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmit = (newNode) => {
    const lastId = getLastId(treeData) + 1;

    setTreeData([
      ...treeData,
      {
        ...newNode,
        id: lastId
      }
    ]);

    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <div className={styles.app}>
              <div>
                <Button onClick={handleOpenDialog} startIcon={<AddIcon />}>
                  Add Node
                </Button>
                {open && (
                  <AddDialog
                    tree={treeData}
                    onClose={handleCloseDialog}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
              <Tree
                tree={treeData}
                rootId={0}
                sort={false}
                insertDroppableFirst={false}
                dropTargetOffset={5}
                canDrop={(tree, { dragSource, dropTargetId }) => {
                  if (dragSource?.parent === dropTargetId) {
                    return true;
                  }
                }}
                render={(node, options) => (
                  <CustomNode
                    node={node}
                    {...options}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                    onNewFolder={handleNewFolder}
                    onNewFile={handleNewFile}
                  />
                )}
                dragPreviewRender={(monitorProps) => (
                  <CustomDragPreview monitorProps={monitorProps} />
                )}
                placeholderRender={(node, { depth }) => (
                  <Placeholder node={node} depth={depth} />
                )}
                onDrop={handleDrop}
                classes={{
                  root: styles.treeRoot,
                  draggingSource: styles.draggingSource,
                  // dropTarget: styles.dropTarget,
                  placeholder: styles.placeholderContainer
                }}
              />
            </div>
          </DndProvider>
        </Grid>
        <Grid item xs={6} sx={{ border: "1px solid" }}>
          <Preview tree={treeData} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
