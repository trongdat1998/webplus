import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Tween } from 'rc-tween-one';
import {
  stylesToCss,
} from 'style-utils';
import {
  currentScrollTop,
  toArrayChildren,
  windowHeight,
} from './utils';
import animType from './anim';

export default class BgElement extends React.Component {
  static getDerivedStateFromProps(props, { prevProps, $self }) {
    const nextState = {
      prevProps: props,
    };
    if (prevProps && props !== prevProps) {
      if (props.show) {
        // 取 dom 在 render 之后；
        setTimeout(() => {
          if ($self.video && prevProps.videoResize && $self.videoLoad) {
            $self.onResize();
          }
          if (prevProps.scrollParallax) {
            $self.onScroll();
          }
        })
      }
    }
    return nextState;
  }

  constructor(props) {
    super(props);
    this.isVideo = toArrayChildren(props.children).some(item => item.type === 'video');
    if (this.isVideo) {
      // 如果是 video，删除 grid 系列，位置发生变化，重加载了 video;
      delete animType.grid;
      delete animType.gridBar;
    }
    if (props.scrollParallax) {
      this.scrollParallaxDuration = props.scrollParallax.duration || 450;
    }
    this.video = null;
    this.videoLoad = false;
    this.state = {
      $self: this,
    };
  }

  componentDidMount() {
    this.dom = ReactDOM.findDOMNode(this);
    if (!this.videoLoad) {
      if (this.video && this.props.videoResize) {
        this.video.onloadeddata = this.videoLoadedData;
      }
    }
    if (this.props.scrollParallax) {
      this.tween = new Tween(this.dom, [{
        ease: 'linear', // 放前面是为了在外面设置了可覆盖。
        ...this.props.scrollParallax,
      }]);
      this.tween.init();
      this.onScroll();
      if (window.addEventListener) {
        window.addEventListener('scroll', this.onScroll);
      } else {
        window.attachEvent('onscroll', this.onScroll);
      }
    }
  }

  componentWillUnmount() {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('scroll', this.onScroll);
    } else {
      window.detachEvent('onresize', this.onResize);
      window.detachEvent('onscroll', this.onScroll);
    }
  }

  onScroll = () => {
    const scrollTop = currentScrollTop();
    const domRect = this.dom.parentNode.getBoundingClientRect();
    const offsetTop = domRect.top + scrollTop;
    const height = Math.max(domRect.height, windowHeight());
    const elementShowHeight = scrollTop - offsetTop + height;
    let scale = elementShowHeight / (height + domRect.height);
    scale = scale || 0;
    scale = scale >= 1 ? 1 : scale;
    this.tween.frame(scale * this.scrollParallaxDuration);
  };

  onResize = () => {
    if (!this.props.show) {
      return;
    }
    const domRect = this.dom.getBoundingClientRect();
    const videoDomRect = this.video.getBoundingClientRect();
    this.videoLoad = true;
    let scale;
    const videoRect = {
      display: 'block',
      position: 'relative',
      top: 0,
      left: 0,
    };
    if (domRect.width / domRect.height > videoDomRect.width / videoDomRect.height) {
      scale = domRect.width / videoDomRect.width;
      videoRect.width = domRect.width;
      videoRect.height = videoDomRect.height * scale;
      videoRect.top = -(videoRect.height - domRect.height) / 2;
    } else {
      scale = domRect.height / videoDomRect.height;
      videoRect.height = domRect.height;
      videoRect.width = videoDomRect.width * scale;
      videoRect.left = -(videoRect.width - domRect.width) / 2;
    }

    Object.keys(videoRect).forEach(key => {
      this.video.style[key] = stylesToCss(key, videoRect[key]);
    });
  };

  videoLoadedData = () => {
    this.onResize();
    if (window.addEventListener) {
      window.addEventListener('resize', this.onResize);
    } else {
      window.attachEvent('onresize', this.onResize);
    }
  };

  render() {
    const {
      videoResize,
      scrollParallax,
      show,
      component,
      componentProps,
      ...props
    } = this.props;
    if (this.isVideo && videoResize) {
      const children = toArrayChildren(props.children).map((item, i) =>
        React.cloneElement(item, {
          ...item.props, key: item.key || `bg-video-${i}`, ref: (c) => {
            this.video = c;
            if (typeof item.ref === 'function') {
              item.ref(c);
            }
          }
        })
      );
      props.children = children.length === 1 ? children[0] : children;
    }
    return React.createElement(this.props.component, { ...props, ...componentProps });
  }
}

BgElement.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.any,
  component: PropTypes.any,
  videoResize: PropTypes.bool,
  scrollParallax: PropTypes.object,
  show: PropTypes.bool,
  componentProps: PropTypes.object,
};

BgElement.defaultProps = {
  component: 'div',
  videoResize: true,
  componentProps: {},
};

BgElement.isBannerAnimBgElement = true;
