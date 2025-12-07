-- =============================================
-- MENU BUILDER SYSTEM
-- Advanced dynamic menu management
-- =============================================

-- Drop existing tables if any
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS menus CASCADE;

-- =============================================
-- TABLE: menus
-- Container for different menu locations
-- =============================================
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(50) NOT NULL, -- 'header', 'footer', 'sidebar'
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: menu_items
-- Individual menu items with nested support
-- =============================================
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,

    -- Content
    title VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'category', 'post', 'ebook', 'page', 'custom', 'external'

    -- References (based on type)
    reference_type VARCHAR(50), -- 'post_category', 'ebook_category', 'post', 'ebook', 'page'
    reference_id UUID, -- ID dari category/post/ebook
    url TEXT, -- For custom/external links

    -- Display
    icon VARCHAR(100),
    color VARCHAR(50),
    description TEXT,

    -- Behavior
    target VARCHAR(20) DEFAULT '_self', -- '_self', '_blank'
    css_class VARCHAR(100),

    -- Order & Status
    display_order INTEGER DEFAULT 0,
    level INTEGER DEFAULT 0, -- 0 = root, 1 = child, 2 = grandchild, etc.
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_menu_items_menu_id ON menu_items(menu_id);
CREATE INDEX idx_menu_items_parent_id ON menu_items(parent_id);
CREATE INDEX idx_menu_items_type ON menu_items(type);
CREATE INDEX idx_menu_items_reference ON menu_items(reference_type, reference_id);
CREATE INDEX idx_menu_items_order ON menu_items(menu_id, display_order);
CREATE INDEX idx_menu_items_active ON menu_items(is_active);
CREATE INDEX idx_menus_location ON menus(location);
CREATE INDEX idx_menus_slug ON menus(slug);

-- =============================================
-- TRIGGERS: Auto-update timestamps
-- =============================================
CREATE OR REPLACE FUNCTION update_menu_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_menus_updated_at
    BEFORE UPDATE ON menus
    FOR EACH ROW
    EXECUTE FUNCTION update_menu_updated_at();

CREATE TRIGGER trigger_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_menu_updated_at();

-- =============================================
-- FUNCTION: Auto-calculate level based on parent
-- =============================================
CREATE OR REPLACE FUNCTION calculate_menu_item_level()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.level = 0;
    ELSE
        SELECT level + 1 INTO NEW.level
        FROM menu_items
        WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_level
    BEFORE INSERT OR UPDATE OF parent_id ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_menu_item_level();

-- =============================================
-- RLS POLICIES
-- =============================================
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Public can read active menus
CREATE POLICY "Public can view active menus"
    ON menus FOR SELECT
    USING (is_active = true);

-- Public can read active menu items
CREATE POLICY "Public can view active menu items"
    ON menu_items FOR SELECT
    USING (is_active = true);

-- Authenticated users can read all menus
CREATE POLICY "Authenticated users can view all menus"
    ON menus FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view all menu items"
    ON menu_items FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can modify menus
CREATE POLICY "Admins can manage menus"
    ON menus FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage menu items"
    ON menu_items FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- =============================================
-- DEFAULT DATA: Create default menus
-- =============================================
INSERT INTO menus (name, slug, location, description) VALUES
('Main Navigation', 'main-nav', 'header', 'Primary navigation menu in header'),
('Footer Menu', 'footer-menu', 'footer', 'Links in footer section'),
('Sidebar Menu', 'sidebar-menu', 'sidebar', 'Sidebar navigation menu');

-- =============================================
-- DEFAULT DATA: Create default menu items for Main Navigation
-- =============================================
DO $$
DECLARE
    main_menu_id UUID;
    blog_item_id UUID;
    ebook_item_id UUID;
BEGIN
    -- Get main menu ID
    SELECT id INTO main_menu_id FROM menus WHERE slug = 'main-nav';

    -- Home
    INSERT INTO menu_items (menu_id, title, type, url, icon, display_order)
    VALUES (main_menu_id, 'Home', 'page', '/', 'solar:home-angle-bold-duotone', 1);

    -- Blog (parent)
    INSERT INTO menu_items (menu_id, title, type, url, icon, display_order)
    VALUES (main_menu_id, 'Blog', 'page', '/post', 'solar:document-text-bold-duotone', 2)
    RETURNING id INTO blog_item_id;

    -- Blog children (categories)
    INSERT INTO menu_items (menu_id, parent_id, title, type, reference_type, url, display_order)
    VALUES
        (main_menu_id, blog_item_id, 'Semua Artikel', 'page', NULL, '/post', 1),
        (main_menu_id, blog_item_id, 'Pendidikan', 'category', 'post_category', '/post?category=pendidikan', 2),
        (main_menu_id, blog_item_id, 'Agile', 'category', 'post_category', '/post?category=agile', 3),
        (main_menu_id, blog_item_id, 'Kepemimpinan', 'category', 'post_category', '/post?category=kepemimpinan', 4),
        (main_menu_id, blog_item_id, 'Pesantren', 'category', 'post_category', '/post?category=pesantren', 5);

    -- E-Book (parent)
    INSERT INTO menu_items (menu_id, title, type, url, icon, display_order)
    VALUES (main_menu_id, 'E-Book', 'page', '/ebook', 'solar:book-bold-duotone', 3)
    RETURNING id INTO ebook_item_id;

    -- E-Book children (categories)
    INSERT INTO menu_items (menu_id, parent_id, title, type, reference_type, url, display_order)
    VALUES
        (main_menu_id, ebook_item_id, 'Semua E-Book', 'page', NULL, '/ebook', 1),
        (main_menu_id, ebook_item_id, 'Tauhid', 'category', 'ebook_category', '/ebook?category=tauhid', 2),
        (main_menu_id, ebook_item_id, 'Fiqh', 'category', 'ebook_category', '/ebook?category=fiqh', 3),
        (main_menu_id, ebook_item_id, 'Sirah', 'category', 'ebook_category', '/ebook?category=sirah', 4);

    -- Tentang Saya
    INSERT INTO menu_items (menu_id, title, type, url, icon, display_order)
    VALUES (main_menu_id, 'Tentang Saya', 'page', '/tentang-saya', 'solar:user-bold-duotone', 4);

END $$;

-- =============================================
-- VIEWS: Hierarchical menu structure
-- =============================================
CREATE OR REPLACE VIEW menu_tree AS
WITH RECURSIVE menu_hierarchy AS (
    -- Root items
    SELECT
        mi.*,
        ARRAY[mi.id] as path,
        CAST(mi.title AS TEXT) as full_path
    FROM menu_items mi
    WHERE mi.parent_id IS NULL AND mi.is_active = true

    UNION ALL

    -- Child items
    SELECT
        mi.*,
        mh.path || mi.id,
        CAST(mh.full_path || ' > ' || mi.title AS TEXT)
    FROM menu_items mi
    INNER JOIN menu_hierarchy mh ON mi.parent_id = mh.id
    WHERE mi.is_active = true
)
SELECT * FROM menu_hierarchy
ORDER BY path;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Menu Builder System created successfully!';
    RAISE NOTICE '📋 Tables: menus, menu_items';
    RAISE NOTICE '🔐 RLS policies enabled';
    RAISE NOTICE '📊 Default menus created: main-nav, footer-menu, sidebar-menu';
    RAISE NOTICE '🎯 Ready to use!';
END $$;
