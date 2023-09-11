import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import {
  ArrowRight,
  Delete,
  FileCopy,
  Folder,
  NoteAdd,
  CreateNewFolder
} from "@mui/icons-material";
import { useDragOver } from "@minoru/react-dnd-treeview";
import { TypeIcon } from "./TypeIcon";
import styles from "./CustomNode.module.css";

export const CustomNode = (props) => {
  const [hover, setHover] = useState(false);
  const { id, droppable, data } = props.node;
  const indent = props.depth * 24;

  const handleToggle = (e) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

  return (
    <div
      className={`tree-node ${styles.root}`}
      style={{ paddingInlineStart: indent }}
      {...dragOverProps}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`${styles.expandIconWrapper} ${
          props.isOpen ? styles.isOpen : ""
        }`}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ArrowRight />
          </div>
        )}
      </div>
      <div>
        <TypeIcon droppable={droppable} fileType={data?.fileType} />
      </div>
      <div className={styles.labelGridItem}>
        <Typography variant="body2">{props.node.text}</Typography>
      </div>
      {hover && (
        <>
          <div className={styles.actionButton}>
            <IconButton size="small" onClick={() => props.onDelete(id)}>
              <Delete fontSize="small" />
            </IconButton>
          </div>
          <div className={styles.actionButton}>
            <IconButton size="small" onClick={() => props.onCopy(id)}>
              <FileCopy fontSize="small" />
            </IconButton>
          </div>
          {props.node.droppable && (
            <div className={styles.actionButton}>
              <IconButton
                size="small"
                onClick={() =>
                  props.onNewFolder({
                    text: "new Folder",
                    parent: props.node.id
                  })
                }
              >
                <CreateNewFolder fontSize="small" />
              </IconButton>
            </div>
          )}
          {props.node.droppable && (
            <div className={styles.actionButton}>
              <IconButton
                size="small"
                onClick={() =>
                  props.onNewFile({ text: "new File", parent: props.node.id })
                }
              >
                <NoteAdd fontSize="small" />
              </IconButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};
