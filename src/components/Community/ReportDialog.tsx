'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Box,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (reason: string, detail?: string) => void;
  targetType: 'content' | 'review' | 'user';
  targetId: string;
}

// Map UI reason values to API-compatible values
const mapReasonToApi = (reason: string): 'spam' | 'copyright' | 'inappropriate' | 'other' => {
  switch (reason) {
    case 'spam':
      return 'spam';
    case 'copyright':
      return 'copyright';
    case 'inappropriate':
    case 'abuse':
    case 'misinformation':
      return 'inappropriate';
    default:
      return 'other';
  }
};

const reportReasons = {
  ko: [
    { value: 'spam', label: '스팸/광고' },
    { value: 'abuse', label: '욕설/비하' },
    { value: 'inappropriate', label: '부적절한 내용' },
    { value: 'misinformation', label: '허위 정보' },
    { value: 'copyright', label: '저작권 침해' },
    { value: 'other', label: '기타' },
  ],
  en: [
    { value: 'spam', label: 'Spam/Advertisement' },
    { value: 'abuse', label: 'Abuse/Harassment' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'copyright', label: 'Copyright violation' },
    { value: 'other', label: 'Other' },
  ],
};

export const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onClose,
  onSubmit,
  targetType,
  targetId,
}) => {
  const theme = useTheme();
  const { language } = useLanguage();
  const { user, session } = useAuth();
  const [selectedReason, setSelectedReason] = useState('');
  const [detail, setDetail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason || !user) return;

    setLoading(true);
    setError('');

    try {
      const requestBody = {
        type: targetType,
        target_id: targetId,
        reason: mapReasonToApi(selectedReason),
        reporter_id: user.id,
        ...(detail && { description: detail }),
      };

      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || (language === 'ko' ? '신고 전송에 실패했습니다.' : 'Failed to submit report.'));
      }

      setSuccess(true);
      onSubmit?.(selectedReason, detail);

      // Close after showing success briefly
      setTimeout(() => {
        setSelectedReason('');
        setDetail('');
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : (language === 'ko' ? '오류가 발생했습니다.' : 'An error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setSelectedReason('');
    setDetail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  const reasons = language === 'ko' ? reportReasons.ko : reportReasons.en;

  const getTargetLabel = () => {
    switch (targetType) {
      case 'review':
        return language === 'ko' ? '댓글' : 'comment';
      case 'content':
        return language === 'ko' ? '게시글' : 'post';
      case 'user':
        return language === 'ko' ? '사용자' : 'user';
      default:
        return language === 'ko' ? '항목' : 'item';
    }
  };
  const targetLabel = getTargetLabel();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {language === 'ko' ? `${targetLabel} 신고하기` : `Report ${targetLabel}`}
      </DialogTitle>
      <DialogContent>
        {success ? (
          <Alert severity="success">
            {language === 'ko' ? '신고가 접수되었습니다.' : 'Report submitted successfully.'}
          </Alert>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {!user ? (
              <Alert severity="warning">
                {language === 'ko' ? '신고하려면 로그인이 필요합니다.' : 'Please sign in to submit a report.'}
              </Alert>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {language === 'ko'
                    ? '신고 사유를 선택해주세요.'
                    : 'Please select a reason for reporting.'}
                </Typography>
                <RadioGroup
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                >
                  {reasons.map((reason) => (
                    <FormControlLabel
                      key={reason.value}
                      value={reason.value}
                      control={<Radio size="small" disabled={loading} />}
                      label={reason.label}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.9rem',
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
                {selectedReason === 'other' && (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder={
                      language === 'ko'
                        ? '상세 내용을 입력해주세요...'
                        : 'Please provide more details...'
                    }
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    disabled={loading}
                    sx={{ mt: 2 }}
                  />
                )}
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          {language === 'ko' ? '취소' : 'Cancel'}
        </Button>
        {user && !success && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="error"
            disabled={!selectedReason || loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading
              ? (language === 'ko' ? '전송 중...' : 'Submitting...')
              : (language === 'ko' ? '신고하기' : 'Report')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
