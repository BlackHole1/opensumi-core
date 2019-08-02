import * as React from 'react';
import { TreeProps, TreeContainer, TreeNode } from '../tree';
import { PerfectScrollbar } from '../scrollbar';
import throttle = require('lodash.throttle');

export interface RecycleTreeProps extends TreeProps {
  scrollContentStyle: React.CSSProperties;
  scrollbarStyle: React.CSSProperties;
  // 默认顶部高度
  scrollTop?: number;
  // 预加载数量
  prerenderNumber?: number;
  // 容器高度
  contentNumber: number;
  // 节点高度
  itemLineHeight?: number;
}

export const RecycleTree = (
  {
    nodes,
    multiSelectable,
    scrollbarStyle,
    scrollContentStyle,
    onContextMenu,
    onDrag,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDragEnd,
    onDrop,
    onChange,
    draggable,
    editable,
    onSelect,
    scrollTop,
    prerenderNumber = 10,
    contentNumber,
    itemLineHeight = 22,
  }: RecycleTreeProps,
) => {
  const noop = () => { };
  const [scrollRef, setScrollRef] = React.useState<HTMLDivElement>();
  const [renderedStart, setRenderedStart] = React.useState(0);
  const renderedEnd: number = renderedStart + contentNumber + prerenderNumber;

  const dataProvider = (): TreeNode[] => {
    let renderedFileItems = nodes!.filter((item: TreeNode, index: number) => {
      return renderedStart <= index && index <= renderedEnd;
    });

    renderedFileItems = renderedFileItems.map((item: TreeNode, index: number) => {
      return {
        ...item,
        order: renderedStart + index,
      };
    });
    return renderedFileItems;
  };

  React.useEffect(() => {
    if (typeof scrollTop === 'number' && scrollRef) {
      scrollRef.scrollTop = scrollTop;
    }
    setRenderedStart(scrollTop ? Math.ceil(scrollTop / itemLineHeight) : 0);
  }, [scrollTop]);

  const scrollUpHanlder = (element: Element) => {
    const positionIndex = Math.ceil(element.scrollTop / itemLineHeight);
    if (positionIndex > 8) {
      setRenderedStart(positionIndex - 8);
    } else {
      setRenderedStart(0);
    }
  };
  const scrollUpThrottledHandler = throttle(scrollUpHanlder, 200);

  const scrollDownHanlder = (element: Element) => {
    const positionIndex = Math.ceil(element.scrollTop / itemLineHeight);
    if (positionIndex > 8) {
      setRenderedStart(positionIndex - 2);
    } else {
      setRenderedStart(0);
    }
  };

  const scrollDownThrottledHandler = throttle(scrollDownHanlder, 200);

  return <React.Fragment>
    <PerfectScrollbar
      style={scrollbarStyle}
      onScrollUp={scrollUpThrottledHandler}
      onScrollDown={scrollDownThrottledHandler}
      containerRef={(ref) => {
        setScrollRef(ref);
      }}
    >
      <div style={scrollContentStyle}>
        <TreeContainer
          multiSelectable={ multiSelectable }
          nodes={ dataProvider() }
          onContextMenu={ onContextMenu }
          onDrag={ onDrag || noop }
          onDragStart={ onDragStart || noop }
          onDragEnter={ onDragEnter || noop }
          onDragOver={ onDragOver || noop }
          onDragLeave={ onDragLeave || noop }
          onDragEnd={ onDragEnd || noop }
          onChange={ onChange || noop }
          onDrop={ onDrop || noop }
          draggable={ draggable }
          onSelect={ onSelect }
          editable={ editable } />
      </div>
    </PerfectScrollbar>
  </React.Fragment>;
};
