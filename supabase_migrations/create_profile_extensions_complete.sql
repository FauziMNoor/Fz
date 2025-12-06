-- =============================================
-- PROFILE EXTENSIONS - COMPLETE SYSTEM
-- =============================================
-- Description: Tabel untuk user posts (feeds), achievements, certifications, teaching experiences, career timeline
-- Author: Fauzi M. Noor
-- Created: 2025-12-05
-- =============================================

-- 1. USER POSTS (Social Media Style Feeds)
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Content
  message TEXT NOT NULL,
  images TEXT[], -- Array untuk multiple images

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_posts_user_id ON public.user_posts(user_id);
CREATE INDEX idx_user_posts_created_at ON public.user_posts(created_at DESC);

-- 2. POST LIKES
-- =============================================
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.user_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(post_id, user_id) -- Prevent duplicate likes
);

CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON public.post_likes(user_id);

-- 3. POST COMMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.user_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX idx_post_comments_user_id ON public.post_comments(user_id);

-- 4. ACHIEVEMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  organization VARCHAR(255),
  date_received DATE,
  image_url TEXT,

  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);

-- 5. CERTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255) NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_id VARCHAR(255),
  credential_url TEXT,
  image_url TEXT,

  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certifications_user_id ON public.certifications(user_id);

-- 6. TEACHING EXPERIENCES
-- =============================================
CREATE TABLE IF NOT EXISTS public.teaching_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  position VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,

  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teaching_experiences_user_id ON public.teaching_experiences(user_id);

-- 7. CAREER TIMELINE
-- =============================================
CREATE TABLE IF NOT EXISTS public.career_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50), -- 'education', 'work', 'achievement', 'milestone'
  event_date DATE,
  icon VARCHAR(100),

  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_career_timeline_user_id ON public.career_timeline(user_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_posts_updated_at
  BEFORE UPDATE ON public.user_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_post_comments_updated_at
  BEFORE UPDATE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_teaching_experiences_updated_at
  BEFORE UPDATE ON public.teaching_experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_career_timeline_updated_at
  BEFORE UPDATE ON public.career_timeline
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- USER POSTS
ALTER TABLE public.user_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User posts are viewable by everyone"
  ON public.user_posts FOR SELECT USING (true);

CREATE POLICY "Users can insert own posts"
  ON public.user_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.user_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.user_posts FOR DELETE
  USING (auth.uid() = user_id);

-- POST LIKES
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post likes are viewable by everyone"
  ON public.post_likes FOR SELECT USING (true);

CREATE POLICY "Users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- POST COMMENTS
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post comments are viewable by everyone"
  ON public.post_comments FOR SELECT USING (true);

CREATE POLICY "Users can comment on posts"
  ON public.post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.post_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- ACHIEVEMENTS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT USING (true);

CREATE POLICY "Users can insert own achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON public.achievements FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own achievements"
  ON public.achievements FOR DELETE
  USING (auth.uid() = user_id);

-- CERTIFICATIONS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certifications are viewable by everyone"
  ON public.certifications FOR SELECT USING (true);

CREATE POLICY "Users can insert own certifications"
  ON public.certifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own certifications"
  ON public.certifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own certifications"
  ON public.certifications FOR DELETE
  USING (auth.uid() = user_id);

-- TEACHING EXPERIENCES
ALTER TABLE public.teaching_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teaching experiences are viewable by everyone"
  ON public.teaching_experiences FOR SELECT USING (true);

CREATE POLICY "Users can insert own teaching experiences"
  ON public.teaching_experiences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own teaching experiences"
  ON public.teaching_experiences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own teaching experiences"
  ON public.teaching_experiences FOR DELETE
  USING (auth.uid() = user_id);

-- CAREER TIMELINE
ALTER TABLE public.career_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Career timeline is viewable by everyone"
  ON public.career_timeline FOR SELECT USING (true);

CREATE POLICY "Users can insert own career timeline"
  ON public.career_timeline FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career timeline"
  ON public.career_timeline FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own career timeline"
  ON public.career_timeline FOR DELETE
  USING (auth.uid() = user_id);
