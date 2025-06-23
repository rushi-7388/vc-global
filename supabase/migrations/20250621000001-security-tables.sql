-- Create security audit log table
CREATE TABLE IF NOT EXISTS security_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blocked users table
CREATE TABLE IF NOT EXISTS blocked_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    blocked_at TIMESTAMPTZ DEFAULT NOW(),
    blocked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create security settings table
CREATE TABLE IF NOT EXISTS security_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier TEXT NOT NULL,
    action TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    reset_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(identifier, action)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_timestamp ON security_audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_event ON security_audit_log(event);

CREATE INDEX IF NOT EXISTS idx_blocked_users_user_id ON blocked_users(user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_expires_at ON blocked_users(expires_at);

CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON rate_limits(reset_time);

-- Add RLS policies for security tables
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Security audit log policies (only admins can read, system can write)
CREATE POLICY "Admins can read security audit log" ON security_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "System can insert security audit log" ON security_audit_log
    FOR INSERT WITH CHECK (true);

-- Blocked users policies (only admins can manage)
CREATE POLICY "Admins can manage blocked users" ON blocked_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Security settings policies (only admins can manage)
CREATE POLICY "Admins can manage security settings" ON security_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Rate limits policies (system can manage)
CREATE POLICY "System can manage rate limits" ON rate_limits
    FOR ALL USING (true);

-- Insert default security settings
INSERT INTO security_settings (setting_key, setting_value, description) VALUES
('rate_limits', '{"default_limit": 100, "default_window": 60000}', 'Default rate limiting settings'),
('session_timeout', '{"inactive_timeout": 1800000}', 'Session timeout settings (30 minutes)'),
('security_levels', '{"low": {"checks": ["basic"]}, "medium": {"checks": ["basic", "device"]}, "high": {"checks": ["basic", "device", "network"]}}', 'Security level configurations'),
('blocked_ips', '[]', 'List of blocked IP addresses')
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to clean up old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM security_audit_log 
    WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up expired rate limits
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits 
    WHERE reset_time < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up expired blocked users
CREATE OR REPLACE FUNCTION cleanup_expired_blocked_users()
RETURNS void AS $$
BEGIN
    DELETE FROM blocked_users 
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup jobs (if using pg_cron extension)
-- SELECT cron.schedule('cleanup-audit-logs', '0 2 * * *', 'SELECT cleanup_old_audit_logs();');
-- SELECT cron.schedule('cleanup-rate-limits', '*/5 * * * *', 'SELECT cleanup_expired_rate_limits();');
-- SELECT cron.schedule('cleanup-blocked-users', '0 3 * * *', 'SELECT cleanup_expired_blocked_users();'); 