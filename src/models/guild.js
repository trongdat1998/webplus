import getData from "../services/getData";
import route_map from "../config/route_map";
import CONST from "../config/const";
import Cookie from "../utils/cookie";
import { message } from "../lib";
import helper from "../utils/helper";

export default {
  namespace: "guild",

  state: {
    memberProfile: {}, // 个人信息
    originalMemberProfile: {}, // 原始个人信息，用于公会信息编辑
    memberProfile_unlogin: {}, // 个人信息未登录
    // 公会信息
    guild_detail: {},
    original_guild_detail: {}, // 原始公会信息，用于公会信息编辑
    // 翻页数据
    total: 0, // 总条数
    page: 0, // 页码
    rowsPerPage: CONST.rowsPerPage, // 每页条数
    rowsPerPage1: CONST.rowsPerPage1, // 成员列表加载条数
    rowsPerPageOptions: CONST.rowsPerPageOptions, // 条数选项
    tableData: [], // 列表数据

    // 提成明细
    totalCommissions: "", // 总额
    unit: "", // 单位
    guildProfile: {}, // 公会详情
    isFunder: false, // 会长身份
    guildGTP: {}, // 公会算力信息
    myGTP: {}, // 我的算力信息
    mining: null, // 挖矿信息-正在出块
    mined: null, // 挖矿信息-已出块
    uploadImg: [], // 发表文章上传图片
    feedList: [], //帖子列表
    feedMore: true,
    feedStatus: false,
    inviteInfo: {}, // 邀请信息
    rewardReleaseInfo: null, //奖励释放信息
    sharedFeed: null, // 分享文章
    sharedComments: [], // 分享文章评论
    guildId: "", // 公会id
    indexBlockList: [], //首页出块列表
    permission: false, //是否通过权限验证
    block_count_down: [], // 未登录首页爆块
    block_count_down2: {}, // 未登录首页爆块
    mining_block: [], // 登录后首页爆块
    posterUrl: "", // 海报地址
    invite_share_info: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {
      const pathname = history.location.pathname;
      // const ismobile = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|MicroMessenger/i.test(
      //   window.navigator.userAgent
      // );
      // if (ismobile && pathname != route_map.guild_home) {
      //   window.location.href =
      //     window.location.protocol +
      //     "//" +
      //     window.location.hostname +
      //     "/m" +
      //     pathname +
      //     history.location.search;
      // }
      if (
        pathname !== route_map.guild_invite &&
        //pathname !== route_map.guild_home &&
        pathname !== route_map.guild_blocks &&
        //pathname !== route_map.guild_create &&
        pathname !== route_map.guild_shared
      ) {
        dispatch({
          type: "getMemberProfile",
          payload: {}
        });
      }

      history.listen(location => {
        const pathname = location.pathname;
        // let search = location.search.replace("?", "");
        // search = parse(search);
        // 读取公会信息
        if (pathname.indexOf("guild") > -1) {
          dispatch({
            type: "getGuildProfile",
            payload: {
              //guild_id: search.guild_id
            }
          });
        }
      });
    }
  },

  effects: {
    *handleChange({ payload, success }, { put }) {
      yield put({
        type: "save",
        payload
      });
      success && success();
    },
    /**
     * 获取个人信息
     * @param {String} guild_id
     */
    *getMemberProfile({ payload }, { call, put }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("get_member_profile"), { payload });
      if (result.code === "OK") {
        if (payload.member_id) {
          yield put({
            type: "save",
            payload: { authorProfile: result.data }
          });
          return;
        }
        result.data["desc"] = result.data.desc
          ? helper.handleChar(result.data.desc)
          : "";
        yield put({
          type: "save",
          payload: {
            memberProfile: result.data,
            originalMemberProfile: result.data
          }
        });
      }
    },
    /**
     * 获取未登录时个人信息
     * @param {String} member_id
     */
    *getMemberInfo({ payload }, { call, put }) {
      const result = yield call(getData("get_unlogin_member_profile"), {
        payload
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: { memberProfile_unlogin: result.data }
        });
      }
    },
    /**
     * 未登录首页爆块
     * @param {*} param0
     * @param {*} param1
     */
    *block_count_down({ payload }, { call, put }) {
      const result = yield call(getData("block_count_down"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            block_count_down: result.data
          }
        });
      }
    },
    *block_count_down2({ payload }, { call, put }) {
      const result = yield call(getData("block_count_down2"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            block_count_down2: result.data
          }
        });
      }
    },
    /**
     * 登录后首页爆块
     * @param {*} param0
     * @param {*} param1
     */
    *mining_block({ payload }, { call, put }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("mining_block"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            mining_block: result.data
          }
        });
      }
    },
    /**
     * 获取未登录时公会信息
     * @param {String} member_id
     */
    *getGuildInfo({ payload }, { call, put }) {
      const result = yield call(getData("get_unlogin_guild_info"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: { guild_detail: result.data }
        });
      }
    },
    /**
     * 获取公会信息
     * @param {String} guild_id
     */
    *getGuildProfile({ payload, history }, { call, put }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("get_guild_profile"), { payload });
      if (result.code === "OK") {
        const user_id = Cookie.read("user_id");
        if (
          window.location.pathname == route_map.guild &&
          result.data.funderId == "0"
        ) {
          window.location.href = route_map.guild_home;
        }
        result.data["desc"] = result.data.desc
          ? helper.handleChar(result.data.desc)
          : "";
        yield put({
          type: "save",
          payload: {
            guild_detail: result.data,
            original_guild_detail: result.data,
            isFunder: user_id == result.data.funderId
          }
        });
      }
    },
    /**
     * 获取公会算力
     * @param {String} guild_id
     */
    *getGuildGTP({ payload }, { call, put }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("guild_gtp"), { payload });
      yield put({
        type: "save",
        payload: {
          guildGTP: result.data
        }
      });
    },
    /**
     * 获取我的算力
     * @param {String} guild_id
     */
    *getMyGTP({ payload }, { call, put }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("my_gtp"), { payload });
      yield put({
        type: "save",
        payload: {
          myGTP: result.data
        }
      });
    },
    /**
     * 获取挖矿信息
     * @param {String} guild_id
     */
    *getMiningInfo({ payload }, { call, put }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("get_mining_info"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            mining: result.data.mining,
            mined: result.data.mined
          }
        });
      }
    },
    *publishFeed({ payload }, { call, put, select }) {
      const { feedList } = yield select(state => state.guild);
      const result = yield call(getData("publish_feed"), { payload });
      if (result.code === "OK") {
        feedList.unshift(result.data.list[0]);
        yield put({
          type: "save",
          payload: {
            feedList: feedList,
            uploadImg: []
          }
        });
      } else {
        message.error(result.msg);
      }
    },
    *getFeedList({ payload }, { call, put, select }) {
      const feedStatus = yield select(state => state.guild.feedStatus);
      if (feedStatus) return;
      yield put({
        type: "save",
        payload: {
          feedStatus: true
        }
      });
      try {
        const result = yield call(getData("get_feed_list"), { payload });
        const { feedList } = yield select(state => state.guild);
        let lists = payload.from_feed_id ? feedList : [];
        if (result.code === "OK") {
          let feedMore = payload.from_feed_id
            ? result.data.list.length < CONST.rowsPerPage
              ? false
              : true
            : true;
          yield put({
            type: "save",
            payload: {
              feedList: [...lists].concat(result.data.list),
              rowsPerPage: CONST.rowsPerPage,
              feedMore: feedMore
            }
          });
        } else {
          if (payload.from_feed_id) {
            message.error(result.msg);
          }
        }
      } catch (e) {}
      yield put({
        type: "save",
        payload: {
          feedStatus: false
        }
      });
    },
    *getCommonList({ payload }, { call, put, select }) {
      const { feedList, rowsPerPage } = yield select(state => state.guild);
      const result = yield call(getData("get_comment_list"), { payload });
      let commonList = feedList[payload.index]["commonList"] || [];
      if (result.code === "OK") {
        let resultList = result.data.list;
        resultList = resultList.filter(
          list =>
            (feedList[payload.index]["commentIds"] || []).indexOf(list.id) < 0
        );
        commonList = [...commonList].concat(resultList);
        feedList[payload.index]["commonList"] = commonList;
        feedList[payload.index]["commonMore"] =
          result.data.list.length < rowsPerPage ? false : true;
        yield put({
          type: "save",
          payload: {
            feedList: feedList
          }
        });
      } else {
        message.error(result.msg);
      }
    },
    *closeComment({ payload }, { call, put, select }) {
      const { feedList } = yield select(state => state.guild);
      feedList[payload.index]["commonList"] = false;
      feedList[payload.index]["commonMore"] = true;
      feedList[payload.index]["commentIds"] = [];
      yield put({
        type: "save",
        payload: {
          feedList: feedList
        }
      });
    },
    // *saveCommon({ payload }, { call, put, select }) {
    //   const { feedList } = yield select(state => state.guild);
    //   const result = yield call(getData("publish_comment"), { payload });
    //   let commonList = feedList[payload.index]["commonList"] || [];
    //   let commentCount = feedList[payload.index]["commentCount"];
    //   if (result.code === "OK") {
    //     // 已展开评论
    //     if (feedList[payload.index]["commonList"]) {
    //       if (!feedList[payload.index]["commonMore"]) {
    //         commonList.push(result.data.list[0]);
    //         feedList[payload.index]["commonList"] = commonList;
    //       }
    //     }
    //     feedList[payload.index]["commentCount"] = Number(commentCount) + 1;
    //     yield put({
    //       type: "save",
    //       payload: {
    //         feedList: feedList
    //       }
    //     });
    //   } else {
    //     message.error(result.msg);
    //   }
    // },
    *saveCommon({ payload }, { call, put, select }) {
      const { feedList } = yield select(state => state.guild);
      const result = yield call(getData("publish_comment"), { payload });
      let commonList = feedList[payload.index]["commonList"] || [];
      let commentCount = feedList[payload.index]["commentCount"];
      if (result.code === "OK") {
        let ids = feedList[payload.index]["commentIds"] || [];
        ids.push(result.data.list[0].id);
        commonList.filter(
          list =>
            (feedList[payload.index]["commentIds"] || []).indexOf(list.id) < 0
        );
        commonList.unshift(result.data.list[0]);
        feedList[payload.index]["commonList"] = commonList;
        feedList[payload.index]["commentCount"] = Number(commentCount) + 1;
        feedList[payload.index]["commentIds"] = ids;
        yield put({
          type: "save",
          payload: {
            feedList: feedList
          }
        });
      } else {
        message.error(result.msg);
      }
    },
    *likeFeed({ payload }, { call, put, select }) {
      const { feedList } = yield select(state => state.guild);
      const result = yield call(getData("like_feed"), { payload });
      if (result.code === "OK") {
        let likeCount = feedList[payload.index]["likeCount"];
        feedList[payload.index]["likeCount"] = Number(likeCount) + 1;
        feedList[payload.index]["isLike"] = true;
        yield put({
          type: "save",
          payload: {
            feedList: feedList
          }
        });
      } else {
        message.error(result.msg);
      }
    },
    *showCopyModal({ payload }, { put, select }) {
      const { feedList } = yield select(state => state.guild);
      feedList[payload.index]["showCopy"] = payload.showCopy;
      yield put({
        type: "save",
        payload: {
          feedList: feedList
        }
      });
    },
    *showContent({ payload }, { call, put, select }) {
      const { feedList } = yield select(state => state.guild);
      feedList[payload.index]["showContent"] = payload.showContent;
      yield put({
        type: "save",
        payload: {
          feedList: feedList
        }
      });
    },
    *getInviteInfo({ payload }, { call, put }) {
      const result = yield call(getData("invit_info"), { payload });
      yield put({
        type: "save",
        payload: {
          inviteInfo: result.data
        }
      });
    },
    // 邀请分享信息
    *invite_share_info({ payload }, { call, put }) {
      const result = yield call(getData("invite_share_info"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            invite_share_info: result.data
          }
        });
      }
    },
    *getRewardRelease({ payload }, { call, put }) {
      const result = yield call(getData("reward_release"), { payload });
      yield put({
        type: "save",
        payload: {
          rewardReleaseInfo: result.data
        }
      });
    },
    *getFunderRewards({ payload }, { call, put }) {
      const result = yield call(getData("funder_rewards"), { payload });
      yield put({
        type: "save",
        payload: {
          funderRewards: result.data
        }
      });
    },
    *deleteCommon({ payload }, { call, put, select }) {
      const { feedList } = yield select(state => state.guild);
      const result = yield call(getData("remove_comment"), { payload });
      if (result.code === "OK") {
        let commonList = feedList[payload.index]["commonList"] || [];
        let commentCount = feedList[payload.index]["commentCount"];
        let index = commonList.findIndex(
          item => item.id === payload.comment_id
        );
        if (index > -1) {
          commonList.splice(index, 1);
        }
        feedList[payload.index]["commonList"] = commonList;
        feedList[payload.index]["commentCount"] = Number(commentCount) - 1;
        yield put({
          type: "save",
          payload: {
            feedList: feedList
          }
        });
      } else {
        message.error(result.msg);
      }
    },
    *deleteFeed({ payload }, { call, put, select }) {
      const { feedList } = yield select(state => state.guild);
      const result = yield call(getData("remove_feed"), { payload });
      if (result.code === "OK") {
        let index = feedList.findIndex(item => item.id === payload.feed_id);
        if (index > -1) feedList.splice(index, 1);
        yield put({
          type: "save",
          payload: {
            feedList: feedList
          }
        });
      } else {
        message.error(result.msg);
      }
    },
    *topFeed({ payload }, { call }) {
      const result = yield call(getData("top_feed"), { payload });
      if (result.code === "OK") {
        window.location.reload();
      } else {
        message.error(result.msg);
      }
    },
    *cancelTopFeed({ payload }, { call }) {
      const result = yield call(getData("cancel_top_feed"), { payload });
      if (result.code === "OK") {
        window.location.reload();
      } else {
        message.error(result.msg);
      }
    },
    *unloginFeedInfo({ payload }, { call, put, select }) {
      const result = yield call(getData("unlogin_shared"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            unloginFeedInfo: result.data
          }
        });
      }
    },
    *shareFeedInfo({ payload }, { call, put, select }) {
      const { rowsPerPage } = yield select(state => state.guild);
      const result = yield call(getData("share_feed_info"), { payload });
      if (result.code === "OK") {
        let feedList = [result.data.feed];
        feedList[0]["commonList"] = result.data.comments;
        feedList[0]["commonMore"] =
          result.data.comments.length < rowsPerPage ? false : true;
        yield put({
          type: "save",
          payload: {
            feedList: feedList
          }
        });
      }
    },
    /**
     * 会员状态变更
     * @param {String} type remove,mute,unmute
     * @param {String} guild_id
     * @param {String} member_id
     */
    *memberChange({ payload }, { call }) {
      yield call(getData("guild_member_" + payload.type), { payload });
    },
    /**
     * 统一表格获取数据方法
     * @param {Object} payload {page,size,...}
     * @param {String} api  api path
     *
     * param page, 控件的翻页从0开始，接口从1开始，需要处理
     */
    *getTableData({ payload, api }, { call, put }) {
      const result = yield call(getData(api), {
        payload: {
          ...payload,
          page: payload.page === undefined ? 1 : 1 + Number(payload.page),
          size:
            payload.size === undefined
              ? CONST.rowsPerPage
              : Number(payload.size)
        }
      });
      if (result.code === "OK") {
        const data = result.data;
        const { total, page, size, list, ...props } = data;
        yield put({
          type: "save",
          payload: {
            total: Number(total),
            page: page - 1,
            rowsPerPage: size,
            tableData: list,
            ...props
          }
        });
      } else {
        message.error(result.msg);
      }
    },
    /**
     * 清除table记录
     */
    *clearTableData({ payload }, { put }) {
      yield put({
        type: "save",
        payload: {
          total: 0,
          page: 0,
          rowsPerPage: CONST.rowsPerPage,
          tableData: []
        }
      });
    },
    /**
     * 创建,开启公会
     */
    *createGuild({ payload, api, success }, { call, put }) {
      const result = yield call(getData(api), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            guildId: result.data.guildId
          }
        });
        success && success();
      } else {
        message.error(result.msg);
      }
    },
    /**
     * upload
     */
    *upload({ payload, success, fail }, { call, put, select }) {
      const key = Object.keys(payload)[0];
      const images = payload[key];
      let data = new FormData();
      for (let file of images) {
        data.append("image_file", file, file.name);
      }
      const result = yield call(getData("guild_upload"), {
        payload: data,
        upload: 1
      });
      if (result.code === "OK") {
        success && success(result.data);
      } else {
        fail && fail(result.msg);
      }
    },
    *upload_base64({ payload, success, fail }, { call, put, select }) {
      const result = yield call(getData("guild_upload_base64"), { payload });
      console.log(result.data);
      if (result.code === "OK") {
        if (result.data == null) {
          fail && fail(result.msg);
        } else {
          success && success(result.data);
        }
      } else {
        fail && fail(result.msg);
      }
    },
    // save
    *settring_save({ payload, success }, { call, select, put }) {
      const { memberProfile, guild_detail } = yield select(
        state => state.guild
      );
      if (payload.type == "user") {
        const result = yield call(getData("guild_member_detail_change"), {
          payload: {
            //guild_id: memberProfile.guildId,
            nickname: helper.trim(memberProfile.nickname) || "",
            avatar_url: payload.data
              ? payload.data.avatarUrl
              : memberProfile.avatarUrl || "",
            desc: encodeURIComponent(helper.trim(memberProfile.desc)) || ""
          }
        });
        if (result.code !== "OK") {
          message.error(result.msg);
        } else {
          const r = yield call(getData("get_member_profile"), { payload: {} });
          if (r.code == "OK") {
            r.data["desc"] = r.data.desc ? helper.handleChar(r.data.desc) : "";
            yield put({
              type: "save",
              payload: {
                memberProfile: r.data,
                originalMemberProfile: r.data
              }
            });
            if (payload.isFunder) {
              guild_detail["funderNickname"] = r.data.nickname;
              yield put({
                type: "save",
                payload: {
                  guild_detail: guild_detail,
                  original_guild_detail: guild_detail
                }
              });
            }
          }
        }
      } else {
        const result1 = yield call(getData("guild_detail_change"), {
          payload: {
            //guild_id: guild_detail.guildId,
            name: helper.trim(guild_detail.guildName),
            bkg_url: payload.data
              ? payload.data.bkgUrl
              : guild_detail.bkgUrl || "",
            desc: encodeURIComponent(helper.trim(guild_detail.desc)) || ""
          }
        });
        if (result1.code !== "OK") {
          message.error(result1.msg);
        } else {
          const r = yield call(getData("get_guild_profile"), { payload: {} });
          if (r.code == "OK") {
            r.data["desc"] = r.data.desc ? helper.handleChar(r.data.desc) : "";
            yield put({
              type: "save",
              payload: {
                guild_detail: r.data,
                original_guild_detail: r.data
              }
            });
          }
        }
      }
    },
    // invite
    *invite({ payload, history, nojump }, { call, put }) {
      const result = yield call(getData("guild_member_register"), { payload });
      if (result.code === "OK") {
        if (nojump) return;
        //history.push(route_map.guild + "?guild_id=" + result.data.guildId);
        window.location.href = route_map.guild;
        //history.push(route_map.guild);
      } else {
        message.error(result.msg);
      }
    },
    *getIndexBlock({ payload }, { call, put }) {
      const result = yield call(getData("index_block"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            indexBlockList: result.data.list
          }
        });
      }
    },
    *checkPermission({ payload }, { call, put }) {
      const result = yield call(getData("check_permission"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            permission: result.data.success
          }
        });
      }
    },
    *getPoster({ payload }, { call, put }) {
      const result = yield call(getData("get_poster"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            posterUrl: result.data
          }
        });
      }
    },
    *quit({ payload }, { call, put }) {
      const result = yield call(getData("guild_quit"), { payload });
      if (result.code === "OK") {
        window.location.href = route_map.guild_home;
      } else {
        message.error(result.msg);
      }
    }
    // *download({ payload }, { call, put }) {
    //   const result = yield call(getData("download_poster"), { payload });
    // }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
