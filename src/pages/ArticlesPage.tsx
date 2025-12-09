import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Search,
  ThumbsUp,
  MessageCircle,
  Share2,
  Clock,
  TrendingUp,
  PenSquare,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { articles } from "@/data/articlesData";
import { CommentSectionDialog } from "@/components/community/CommentSectionDialog";
import { ArticleEditorDialog } from "@/components/community/ArticleEditorDialog";

export const ArticlesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [showArticleDialog, setShowArticleDialog] = useState(false);
  const [commentArticleId, setCommentArticleId] = useState<string | null>(null);
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const { toast } = useToast();

  const categories = ["all", ...Array.from(new Set(articles.map((a) => a.category)))];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter((a) => a.featured).slice(0, 3);

  const handleReadArticle = (article: typeof articles[0]) => {
    setSelectedArticle(article);
    setShowArticleDialog(true);
  };

  const handleLike = (articleId: string) => {
    toast({
      title: "Liked",
      description: "You liked this article",
    });
  };

  const handleComment = (articleId: string) => {
    setCommentArticleId(articleId);
  };

  const handleShare = (articleId: string) => {
    toast({
      title: "Shared",
      description: "Article shared successfully!",
    });
  };

  const handleWriteArticle = () => {
    setShowArticleEditor(true);
  };

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Community Articles</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Read and share insightful articles from community members
            </p>
          </Card>

          {/* Search & Write */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleWriteArticle} size="icon" className="flex-shrink-0">
              <PenSquare className="h-4 w-4" />
            </Button>
          </div>

          {/* Featured Articles Carousel */}
          {featuredArticles.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Featured Articles
              </h2>
              <div className="grid gap-3">
                {featuredArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleReadArticle(article)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/40" />
                    </div>
                    <div className="p-4 space-y-2">
                      <Badge>{article.category}</Badge>
                      <h3 className="font-bold text-lg leading-tight">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={article.author.avatar} alt={article.author.name} />
                          <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {article.author.name} •{" "}
                      {formatDistanceToNow(article.publishDate, { addSuffix: true })}
                    </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-3 mt-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleReadArticle(article)}
                  >
                    {/* Author Info */}
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={article.author.avatar} alt={article.author.name} />
                        <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{article.author.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(article.publishDate, { addSuffix: true })} •{" "}
                          {article.readTime} min read
                        </p>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div>
                      <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>

                    <Separator />

                    {/* Engagement Stats */}
                    <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {article.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {article.comments}
                      </span>
                      <Button variant="ghost" size="sm" className="justify-end h-auto p-0">
                        <Eye className="h-4 w-4 mr-1" />
                        Read
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium">No articles found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adjusting your search or category filter
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Article Reader Dialog */}
      <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <ScrollArea className="max-h-[90vh]">
            {selectedArticle && (
              <div className="p-6 space-y-4">
                <DialogHeader>
                  <Badge className="w-fit mb-2">{selectedArticle.category}</Badge>
                  <DialogTitle className="text-2xl leading-tight">
                    {selectedArticle.title}
                  </DialogTitle>
                </DialogHeader>

                {/* Author & Meta */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedArticle.author.avatar}
                      alt={selectedArticle.author.name}
                    />
                    <AvatarFallback>
                      {selectedArticle.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedArticle.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(selectedArticle.publishDate, { addSuffix: true })} •{" "}
                      {selectedArticle.readTime} min read
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Article Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground italic">{selectedArticle.excerpt}</p>
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                    className="mt-4 space-y-4 text-sm leading-relaxed"
                  />
                </div>

                <Separator />

                {/* Engagement Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLike(selectedArticle.id)}
                    className="w-full"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Like ({selectedArticle.likes})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleComment(selectedArticle.id)}
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comment ({selectedArticle.comments})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(selectedArticle.id)}
                    className="w-full"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <CommentSectionDialog
        open={commentArticleId !== null}
        onOpenChange={(open) => !open && setCommentArticleId(null)}
        title="Article Comments"
        contextId={commentArticleId || ""}
      />

      {/* Article Editor Dialog */}
      <ArticleEditorDialog 
        open={showArticleEditor} 
        onOpenChange={setShowArticleEditor} 
      />
    </>
  );
};
