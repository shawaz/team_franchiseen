'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Send,
  Plus,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  Circle,
  PlayCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function HomePage() {
  const { user } = useUser();
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAgendaItem, setNewAgendaItem] = useState({ title: '', description: '', period: 'today' as const, priority: 'medium' as const });
  const [showAddForm, setShowAddForm] = useState<string | null>(null);

  // Queries
  const todayItems = useQuery(api.agenda.getAgendaItems, { period: 'today' }) || [];
  const weekItems = useQuery(api.agenda.getAgendaItems, { period: 'week' }) || [];
  const monthItems = useQuery(api.agenda.getAgendaItems, { period: 'month' }) || [];
  const quarterItems = useQuery(api.agenda.getAgendaItems, { period: 'quarter' }) || [];
  const agendaSummary = useQuery(api.agenda.getAgendaSummary) || {
    today: { total: 0, completed: 0, pending: 0, inProgress: 0 },
    week: { total: 0, completed: 0, pending: 0, inProgress: 0 },
    month: { total: 0, completed: 0, pending: 0, inProgress: 0 },
    quarter: { total: 0, completed: 0, pending: 0, inProgress: 0 },
  };

  // Mutations
  const createAgendaItem = useMutation(api.agenda.createAgendaItem);
  const updateAgendaItem = useMutation(api.agenda.updateAgendaItem);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: chatMessage };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setChatMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages([...newMessages, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact support if the issue persists.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAgendaItem = async (period: 'today' | 'week' | 'month' | 'quarter') => {
    if (!newAgendaItem.title.trim()) return;

    try {
      await createAgendaItem({
        ...newAgendaItem,
        period,
        status: 'pending',
        userId: user?.id || '',
      });
      setNewAgendaItem({ title: '', description: '', period: 'today', priority: 'medium' });
      setShowAddForm(null);
    } catch (error) {
      console.error('Error creating agenda item:', error);
    }
  };

  const handleToggleStatus = async (itemId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' :
                     currentStatus === 'pending' ? 'in-progress' : 'completed';

    try {
      await updateAgendaItem({ id: itemId as any, status: newStatus });
    } catch (error) {
      console.error('Error updating agenda item:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <PlayCircle className="h-4 w-4 text-blue-500" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'there'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let's make today productive with Franny's help
          </p>
        </div>

        {/* Ask Franny AI Section */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <div className="p-2 bg-white/20 rounded-full">
                <Bot className="h-8 w-8" />
              </div>
              Ask Franny <Sparkles className="h-6 w-6" />
            </CardTitle>
            <p className="text-purple-100">
              Your AI assistant for franchise management, business insights, and more!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Chat Messages */}
            {chatMessages.length > 0 && (
              <div className="bg-white/10 rounded-lg p-4 max-h-60 overflow-y-auto space-y-3">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-gray-800'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Franny is thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask Franny anything about your franchise..."
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-purple-200"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!chatMessage.trim() || isLoading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Quick Actions */}
            {chatMessages.length === 0 && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => setChatMessage("How can I improve my franchise performance?")}
                >
                  Performance Tips
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => setChatMessage("Show me my investment summary")}
                >
                  Investment Summary
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => setChatMessage("What are the latest franchise trends?")}
                >
                  Market Trends
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => setChatMessage("Help me plan my next business move")}
                >
                  Business Planning
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agenda Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Agenda */}
          <AgendaCard
            title="Today"
            icon={<Clock className="h-5 w-5" />}
            items={todayItems}
            summary={agendaSummary.today}
            period="today"
            showAddForm={showAddForm === 'today'}
            onShowAddForm={() => setShowAddForm(showAddForm === 'today' ? null : 'today')}
            onAddItem={() => handleAddAgendaItem('today')}
            onToggleStatus={handleToggleStatus}
            newAgendaItem={newAgendaItem}
            setNewAgendaItem={setNewAgendaItem}
            getStatusIcon={getStatusIcon}
            getPriorityColor={getPriorityColor}
          />

          {/* This Week's Agenda */}
          <AgendaCard
            title="This Week"
            icon={<Calendar className="h-5 w-5" />}
            items={weekItems}
            summary={agendaSummary.week}
            period="week"
            showAddForm={showAddForm === 'week'}
            onShowAddForm={() => setShowAddForm(showAddForm === 'week' ? null : 'week')}
            onAddItem={() => handleAddAgendaItem('week')}
            onToggleStatus={handleToggleStatus}
            newAgendaItem={newAgendaItem}
            setNewAgendaItem={setNewAgendaItem}
            getStatusIcon={getStatusIcon}
            getPriorityColor={getPriorityColor}
          />

          {/* This Month's Agenda */}
          <AgendaCard
            title="This Month"
            icon={<Target className="h-5 w-5" />}
            items={monthItems}
            summary={agendaSummary.month}
            period="month"
            showAddForm={showAddForm === 'month'}
            onShowAddForm={() => setShowAddForm(showAddForm === 'month' ? null : 'month')}
            onAddItem={() => handleAddAgendaItem('month')}
            onToggleStatus={handleToggleStatus}
            newAgendaItem={newAgendaItem}
            setNewAgendaItem={setNewAgendaItem}
            getStatusIcon={getStatusIcon}
            getPriorityColor={getPriorityColor}
          />

          {/* This Quarter's Agenda */}
          <AgendaCard
            title="This Quarter"
            icon={<Target className="h-5 w-5" />}
            items={quarterItems}
            summary={agendaSummary.quarter}
            period="quarter"
            showAddForm={showAddForm === 'quarter'}
            onShowAddForm={() => setShowAddForm(showAddForm === 'quarter' ? null : 'quarter')}
            onAddItem={() => handleAddAgendaItem('quarter')}
            onToggleStatus={handleToggleStatus}
            newAgendaItem={newAgendaItem}
            setNewAgendaItem={setNewAgendaItem}
            getStatusIcon={getStatusIcon}
            getPriorityColor={getPriorityColor}
          />
        </div>
      </div>
    </div>
  );
}

// AgendaCard Component
interface AgendaCardProps {
  title: string;
  icon: React.ReactNode;
  items: any[];
  summary: { total: number; completed: number; pending: number; inProgress: number };
  period: 'today' | 'week' | 'month' | 'quarter';
  showAddForm: boolean;
  onShowAddForm: () => void;
  onAddItem: () => void;
  onToggleStatus: (id: string, status: string) => void;
  newAgendaItem: { title: string; description: string; period: string; priority: string };
  setNewAgendaItem: (item: any) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getPriorityColor: (priority: string) => string;
}

function AgendaCard({
  title,
  icon,
  items,
  summary,
  period,
  showAddForm,
  onShowAddForm,
  onAddItem,
  onToggleStatus,
  newAgendaItem,
  setNewAgendaItem,
  getStatusIcon,
  getPriorityColor,
}: AgendaCardProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onShowAddForm}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>

        {/* Summary Stats */}
        <div className="flex gap-2 text-sm">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {summary.completed} completed
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {summary.inProgress} in progress
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {summary.pending} pending
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Form */}
        {showAddForm && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <Input
              placeholder="What needs to be done?"
              value={newAgendaItem.title}
              onChange={(e) => setNewAgendaItem({ ...newAgendaItem, title: e.target.value })}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newAgendaItem.description}
              onChange={(e) => setNewAgendaItem({ ...newAgendaItem, description: e.target.value })}
              rows={2}
            />
            <div className="flex gap-2">
              <select
                value={newAgendaItem.priority}
                onChange={(e) => setNewAgendaItem({ ...newAgendaItem, priority: e.target.value })}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <Button size="sm" onClick={onAddItem} disabled={!newAgendaItem.title.trim()}>
                Add Item
              </Button>
            </div>
          </div>
        )}

        {/* Agenda Items */}
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No items for {title.toLowerCase()}. Click + to add one!
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
              >
                <button
                  onClick={() => onToggleStatus(item._id, item.status)}
                  className="mt-0.5 hover:scale-110 transition-transform"
                >
                  {getStatusIcon(item.status)}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium ${item.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.title}
                    </h4>
                    <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  )}
                  {item.dueDate && (
                    <p className="text-xs text-gray-500">Due: {item.dueDate}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}