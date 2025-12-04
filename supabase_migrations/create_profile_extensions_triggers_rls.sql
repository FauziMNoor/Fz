-- =====================================================
-- TRIGGERS & RLS POLICIES - Profile Extensions
-- =====================================================
-- Created: 2025-12-03
-- Purpose: Auto-update timestamps and Row Level Security policies
-- =====================================================

-- =====================================================
-- AUTO-UPDATE TIMESTAMPS TRIGGERS
-- =====================================================

-- Portfolios
CREATE OR REPLACE FUNCTION update_portfolios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolios_updated_at();

-- User Posts
CREATE OR REPLACE FUNCTION update_user_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_posts_updated_at
  BEFORE UPDATE ON user_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_user_posts_updated_at();

-- Post Comments
CREATE OR REPLACE FUNCTION update_post_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_updated_at();

-- Achievements
CREATE OR REPLACE FUNCTION update_achievements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_achievements_updated_at();

-- Certifications
CREATE OR REPLACE FUNCTION update_certifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER certifications_updated_at
  BEFORE UPDATE ON certifications
  FOR EACH ROW
  EXECUTE FUNCTION update_certifications_updated_at();

-- Teaching Experiences
CREATE OR REPLACE FUNCTION update_teaching_experiences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teaching_experiences_updated_at
  BEFORE UPDATE ON teaching_experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_teaching_experiences_updated_at();

-- Career Timeline
CREATE OR REPLACE FUNCTION update_career_timeline_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER career_timeline_updated_at
  BEFORE UPDATE ON career_timeline
  FOR EACH ROW
  EXECUTE FUNCTION update_career_timeline_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaching_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_timeline ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PORTFOLIOS POLICIES
-- =====================================================
-- Anyone can view portfolios
CREATE POLICY "Portfolios are viewable by everyone"
  ON portfolios FOR SELECT
  USING (true);

-- Users can insert their own portfolios
CREATE POLICY "Users can insert their own portfolios"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own portfolios
CREATE POLICY "Users can update their own portfolios"
  ON portfolios FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own portfolios
CREATE POLICY "Users can delete their own portfolios"
  ON portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- USER POSTS POLICIES
-- =====================================================
-- Anyone can view posts
CREATE POLICY "Posts are viewable by everyone"
  ON user_posts FOR SELECT
  USING (true);

-- Users can insert their own posts
CREATE POLICY "Users can insert their own posts"
  ON user_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
  ON user_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON user_posts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- POST LIKES POLICIES
-- =====================================================
-- Anyone can view likes
CREATE POLICY "Likes are viewable by everyone"
  ON post_likes FOR SELECT
  USING (true);

-- Authenticated users can like posts
CREATE POLICY "Authenticated users can like posts"
  ON post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
  ON post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- POST COMMENTS POLICIES
-- =====================================================
-- Anyone can view comments
CREATE POLICY "Comments are viewable by everyone"
  ON post_comments FOR SELECT
  USING (true);

-- Authenticated users can comment
CREATE POLICY "Authenticated users can comment"
  ON post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON post_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- ACHIEVEMENTS POLICIES
-- =====================================================
-- Anyone can view achievements
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);

-- Users can insert their own achievements
CREATE POLICY "Users can insert their own achievements"
  ON achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own achievements
CREATE POLICY "Users can update their own achievements"
  ON achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own achievements
CREATE POLICY "Users can delete their own achievements"
  ON achievements FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- CERTIFICATIONS POLICIES
-- =====================================================
-- Anyone can view certifications
CREATE POLICY "Certifications are viewable by everyone"
  ON certifications FOR SELECT
  USING (true);

-- Users can insert their own certifications
CREATE POLICY "Users can insert their own certifications"
  ON certifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own certifications
CREATE POLICY "Users can update their own certifications"
  ON certifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own certifications
CREATE POLICY "Users can delete their own certifications"
  ON certifications FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TEACHING EXPERIENCES POLICIES
-- =====================================================
-- Anyone can view teaching experiences
CREATE POLICY "Teaching experiences are viewable by everyone"
  ON teaching_experiences FOR SELECT
  USING (true);

-- Users can insert their own teaching experiences
CREATE POLICY "Users can insert their own teaching experiences"
  ON teaching_experiences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own teaching experiences
CREATE POLICY "Users can update their own teaching experiences"
  ON teaching_experiences FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own teaching experiences
CREATE POLICY "Users can delete their own teaching experiences"
  ON teaching_experiences FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- CAREER TIMELINE POLICIES
-- =====================================================
-- Anyone can view career timeline
CREATE POLICY "Career timeline is viewable by everyone"
  ON career_timeline FOR SELECT
  USING (true);

-- Users can insert their own career timeline
CREATE POLICY "Users can insert their own career timeline"
  ON career_timeline FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own career timeline
CREATE POLICY "Users can update their own career timeline"
  ON career_timeline FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own career timeline
CREATE POLICY "Users can delete their own career timeline"
  ON career_timeline FOR DELETE
  USING (auth.uid() = user_id);

