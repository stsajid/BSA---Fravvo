-- Seed data for development
INSERT INTO organizations (id, name, slug, domain, subscription_tier) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Acme Corporation', 'acme-corp', 'acme.com', 'enterprise'),
    ('550e8400-e29b-41d4-a716-446655440002', 'TechStart Inc', 'techstart', 'techstart.io', 'professional');

INSERT INTO users (id, email, name, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440010', 'admin@acme.com', 'John Admin', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440011', 'sarah@acme.com', 'Sarah Johnson', 'manager'),
    ('550e8400-e29b-41d4-a716-446655440012', 'mike@techstart.io', 'Mike Chen', 'admin');

INSERT INTO organization_members (organization_id, user_id, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'manager'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', 'admin');

INSERT INTO workspaces (id, organization_id, name, description, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 'Product Development', 'Main product development workspace', '550e8400-e29b-41d4-a716-446655440010'),
    ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 'Marketing', 'Marketing campaigns and content', '550e8400-e29b-41d4-a716-446655440011');

INSERT INTO projects (id, organization_id, workspace_id, name, description, status, priority, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', 'Q1 Platform Redesign', 'Complete redesign of the platform UI/UX', 'active', 'high', '550e8400-e29b-41d4-a716-446655440010'),
    ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 'Brand Refresh Campaign', 'Update brand guidelines and marketing materials', 'active', 'medium', '550e8400-e29b-41d4-a716-446655440011');

INSERT INTO tasks (id, organization_id, project_id, title, description, status, priority, assignee_id, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440030', 'Design new dashboard layout', 'Create wireframes and mockups for the new dashboard', 'in_progress', 'high', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440010'),
    ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440030', 'Implement responsive navigation', 'Build mobile-first navigation component', 'todo', 'medium', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010');
