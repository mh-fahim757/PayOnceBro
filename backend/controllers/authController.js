import supabase from '../config/db.js'

export const register = async (req, res, next) => {
  try {
    const { email, password, role, username, full_name } = req.body

    if (!email || !password || !role || !username || !full_name) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    })

    if (error) {
      const status = error.status || 400
      return res.status(status).json({ message: error.message })
    }

    // Trigger already created the profile row — update it with name fields
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username, full_name, role })
        .eq('id', data.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError.message)
      }
    }

    res.status(201).json({
      session: data.session,
      user: data.user,
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({ message: error.message })
    }

    res.json({
      session: data.session,
      user: data.user,
    })
  } catch (err) {
    next(err)
  }
}

export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (token) {
      // Invalidate the session server-side using the service role client
      await supabase.auth.admin.signOut(token)
    }
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware — id, email, role from the verified Supabase JWT
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, role, username, full_name, created_at')
      .eq('id', req.user.id)
      .single()

    if (error) throw error

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        aud: 'authenticated',
        // Prefer the role from the JWT which was set correctly at signup
        role: req.user.role && req.user.role !== 'user' ? req.user.role : profile.role,
        username: profile.username,
        full_name: profile.full_name,
        created_at: profile.created_at,
      },
    })
  } catch (err) {
    console.error('getMe error:', err);
    next(err)
  }
}
