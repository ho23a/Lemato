import React from 'react';
import StatusUpdate from './Statusupdate';
import CommentThread from './Commentthread';
import Comment from './Comment';
import {postComment} from '../server';
import {likeFeedItem} from '../server';
import {unlikeFeedItem} from '../server';
// import {handleShareClick} from '../server';

export default class FeedItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = props.data;
    }

    handleCommentPost(commentText) {
        postComment(this.state._id, 1, commentText, (updatedFeedItem) => {
            this.setState(updatedFeedItem);
        });
    }

    handleLikeClick(clickEvent) {
        clickEvent.preventDefault();
        if (clickEvent.button === 0) {
            var callbackFunction = (updatedLikeCounter) => {
                this.setState({chefPoints: updatedLikeCounter});
            };
            if (this.didUserLike()) {
                unlikeFeedItem(this.state._id, 1, callbackFunction);
            } else {
                likeFeedItem(this.state._id, 1, callbackFunction);
            }
        }
    }

    // //TODO: Change to Share
    // handleShareClick(clickEvent) {
    //   clickEvent.preventDefault();
    //   var popup = document.getElementById('myPopup');
    //   popup.classList.toggle('show');
    // }

    didUserLike() {
        var chefPoints = this.state.chefPoints;
        //console.log(chefPoints);
        var liked = false;
        for (var i = 0; i < chefPoints.length; i++) {
            if (chefPoints[i]._id === 1) {
                liked = true;
                break;
            }
        }
        return liked;
    }

    //TODO: Change up what it looks like here
    render() {
        var likeButtonText = "Like";
        if (this.didUserLike()) {
            likeButtonText = "Unlike";
        }

        var data = this.state;
        var contents;
        switch (data.type) {
            case "statusUpdate":
                contents = (
                    <StatusUpdate key={data._id}
                        author={data.contents.author}
                        postDate={data.contents.postDate}
                        location={data.contents.location}>
                        {data.contents.contents.split("\n").map((line, i) => {
                            return (
                                <p key={"line" + i}>{line}</p>
                            );
                        })}
                    </StatusUpdate>
                );
                break;
        }

        return (
          <div>
          <div className="col-md-1">
          </div>
            <div className="panel panel-default col-md-6 outline" id="home">
                <div className="recipe-share">
                      <div className="row">
                        <div className="col-md-12">
                          <hr/>
                    {this.state.name}
                    {this.state.postDate}
                    {this.state.pic}
                    {this.state.description}
                </div>
              </div>
            </div>
          <div className="row">
            <div className="col-md-2">
              <a href="#" onClick={(e) => this.handleLikeClick(e)}>
                  <span className="glyphicon glyphicon-cutlery"></span> {likeButtonText}
              </a>
            </div>
          </div>

                <div className="panel-footer">
                    <div className="row">
                        <div className="col-md-12">
                            <a href="#">{data.chefPoints.length} </a> chef points
                        </div>
                    </div>
                </div>
              <div className="panel-footer">

                    <CommentThread onPost={(commentText) => this.handleCommentPost(commentText)}>
                        {data.comments.map((comment, i) => {
                            // i is comment's index in comments array
                            return (
                                <Comment key={i}
                                        commentIdx={i}
                                        data={comment}
                                        feedItemID={data._id}
                                        chefPoints = {comment.chefPoints}
                                        author={comment.author}
                                        postDate={comment.postDate}>
                                  {comment.contents}
                                </Comment>
                            );
                        })}
                        </CommentThread>
               </div>
             </div>
             </div>
        )
    }
}
