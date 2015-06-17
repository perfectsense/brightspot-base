package com.brightspotbase;

import com.psddev.cms.db.Content;
import com.psddev.cms.db.Renderer;
import com.psddev.cms.db.Site;
import com.psddev.dari.db.Query;
import com.psddev.dari.db.Record;
import com.psddev.dari.db.Recordable;
import com.psddev.dari.util.PaginatedResult;
import com.psddev.social.Tweet;
import com.psddev.social.TwitterFeed;

import java.util.List;

@Renderer.Path("/render/modules/twitter-module.jsp")
@Renderer.EmbedPath("/render/common/embed.jsp")
@Renderer.EmbedPreviewWidth(900)
public class TwitterModule extends Content implements FullWidthModule {

    private String name;
    @Embedded
    @Indexed
    private TweetOption feed;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TweetOption getFeed() {
        return feed;
    }

    public void setFeed(TweetOption feed) {
        this.feed = feed;
    }

    public static class DynamicFeed extends Record implements TweetOption {

        @Indexed
        private TwitterFeed twitterFeed;

        public TwitterFeed getTwitterFeed() {
            return twitterFeed;
        }

        public void setTwitterFeed(TwitterFeed twitterFeed) {
            this.twitterFeed = twitterFeed;
        }

        public PaginatedResult<Tweet> getTweets(Site site) {

            Query query = Query.from(Tweet.class);
            if (site != null) {
                query.where(site.itemsPredicate());
            }
            return query.where("source = ?", this.twitterFeed).select(0, 3);
        }


    }


    public static class CuratedFeed extends Record implements TweetOption {

        private List<Tweet> tweets;

        public List<Tweet> getTweets() {
            return tweets;
        }

        public void setTweets(List<Tweet> tweets) {
            this.tweets = tweets;
        }
    }

    public interface TweetOption extends Recordable {


    }
}
