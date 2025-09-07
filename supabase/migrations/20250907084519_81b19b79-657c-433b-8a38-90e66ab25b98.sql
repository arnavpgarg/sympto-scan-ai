-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Users table policies - users can only see their own data
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

-- Documents table policies - users can only access their own documents
CREATE POLICY "Users can view their own documents" 
ON public.documents 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own documents" 
ON public.documents 
FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own documents" 
ON public.documents 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- Messages table policies - users can only access their own messages
CREATE POLICY "Users can view their own messages" 
ON public.messages 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own messages" 
ON public.messages 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- Summaries table policies - users can only access summaries of their own documents
CREATE POLICY "Users can view summaries of their own documents" 
ON public.summaries 
FOR SELECT 
USING (
  document_id IN (
    SELECT id FROM public.documents WHERE user_id = auth.uid()::text
  )
);

CREATE POLICY "Users can create summaries for their own documents" 
ON public.summaries 
FOR INSERT 
WITH CHECK (
  document_id IN (
    SELECT id FROM public.documents WHERE user_id = auth.uid()::text
  )
);

CREATE POLICY "Users can update summaries of their own documents" 
ON public.summaries 
FOR UPDATE 
USING (
  document_id IN (
    SELECT id FROM public.documents WHERE user_id = auth.uid()::text
  )
);

CREATE POLICY "Users can delete summaries of their own documents" 
ON public.summaries 
FOR DELETE 
USING (
  document_id IN (
    SELECT id FROM public.documents WHERE user_id = auth.uid()::text
  )
);