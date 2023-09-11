import React, { useState } from "react";
import { Box } from "@mui/material";
import styles from "./Preview.module.css";

export const Preview = (props) => {
  const nestedObject = convertToNestedArray(props.tree);

  return (
    <Box>
      <NestedTree data={nestedObject} />
    </Box>
  );
};

function convertToNestedArray(flatArray) {
  const idToObjMap = {}; // Map to store objects by their id
  const result = [];

  // Create a mapping of id to objects
  for (const item of flatArray) {
    const { id, parent, ...rest } = item;
    idToObjMap[id] = { id, ...rest, children: [] };
  }

  // Build the nested structure
  for (const item of flatArray) {
    const { id, parent } = item;
    const currentObject = idToObjMap[id];

    if (parent === 0) {
      // If the item has no parent, add it to the result
      result.push(currentObject);
    } else {
      // If the item has a parent, add it as a child of the parent
      const parentObject = idToObjMap[parent];
      parentObject.children.push(currentObject);
    }
  }

  return result;
}

function TreeNode({ node }) {
  if (node.children && node.children.length > 0) {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        {node.children.map((child) => (
          <TreeNode key={child.id} node={child} />
        ))}
      </div>
    );
  } else {
    return <div>{node.text}</div>;
  }
}

function NestedTree({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {data.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
}
