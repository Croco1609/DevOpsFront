import React from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useTranslation } from 'react-i18next';

interface HomeTourProps {
  run: boolean;
  onFinish: () => void;
}

const HomeTour: React.FC<HomeTourProps> = ({ run, onFinish }) => {
  const { t } = useTranslation();

  const steps = [
    {
      target: '.form-component',
      disableBeacon: true,
      content: 'This is a form component'
    },
    
    {
      target: '.step1',
      content: t('HomeTour.step1'),
    },
    {
      target: '.step2',
      content: t('HomeTour.step2'),
    },
    {
      target: '.step3',
      content: t('HomeTour.step3'),
    },
    {
      target: '.step4',
      content: t('HomeTour.step4'),
    },
    {
      target: '.step5',
      content: t('HomeTour.step5'),
    },
  ];

  const locale = {
    back: t('tour.back'),
    close: t('tour.close'),
    last: t('tour.last'),
    next: t('tour.next'),
    skip: t('tour.skip'),
  };

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      locale={locale}
      styles={{
        options: {
          zIndex: 10000,
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          primaryColor: '#ff5733',
          textColor: '#333333',
          spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
        },
        buttonNext: {
          backgroundColor: '#ff5733',
          color: '#ffffff',
        },
        buttonBack: {
          color: '#ff5733',
        },
        buttonClose: {
          color: '#ff5733',
        },
      }}
      callback={handleCallback}
    />
  );
};

export default HomeTour;
