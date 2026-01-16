import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  LogoIcon,
  MedalIcon,
  MapIcon,
  PlaneIcon,
  GiftIcon,
  LightBulbIcon,
  WalletIcon,
  ChartIcon,
  MagnifierIcon,
} from './Icons';

describe('Icons', () => {
  describe('LogoIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<LogoIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox dimensions', () => {
      const { container } = render(<LogoIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('has proper styling classes', () => {
      const { container } = render(<LogoIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('lucide', 'lucide-panels-top-left', 'mr-2', 'h-6', 'w-6');
    });
  });

  describe('MedalIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<MedalIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox dimensions', () => {
      const { container } = render(<MedalIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 128 128');
    });

    it('has proper styling classes', () => {
      const { container } = render(<MedalIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('fill-primary', 'w-14');
    });
  });

  describe('MapIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<MapIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox dimensions', () => {
      const { container } = render(<MapIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 128 128');
    });

    it('has proper styling classes', () => {
      const { container } = render(<MapIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('fill-primary', 'w-14');
    });
  });

  describe('PlaneIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<PlaneIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox dimensions', () => {
      const { container } = render(<PlaneIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 128 128');
    });

    it('has proper styling classes', () => {
      const { container } = render(<PlaneIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('fill-primary', 'w-14');
    });
  });

  describe('GiftIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<GiftIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox dimensions', () => {
      const { container } = render(<GiftIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 128 128');
    });

    it('has proper styling classes', () => {
      const { container } = render(<GiftIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('fill-primary', 'w-14');
    });
  });

  describe('LightBulbIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<LightBulbIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox dimensions', () => {
      const { container } = render(<LightBulbIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 128 128');
    });

    it('has proper styling classes', () => {
      const { container } = render(<LightBulbIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('fill-primary', 'w-12');
    });
  });

  describe('WalletIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<WalletIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox dimensions', () => {
      const { container } = render(<WalletIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 128 128');
    });

    it('has proper styling classes', () => {
      const { container } = render(<WalletIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('fill-primary', 'w-12');
    });
  });

  describe('ChartIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<ChartIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox dimensions', () => {
      const { container } = render(<ChartIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 128 128');
    });

    it('has proper styling classes', () => {
      const { container } = render(<ChartIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('fill-primary', 'w-12');
    });
  });

  describe('MagnifierIcon', () => {
    it('renders SVG element', () => {
      const { container } = render(<MagnifierIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has correct viewBox dimensions', () => {
      const { container } = render(<MagnifierIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 128 128');
    });

    it('has proper styling classes', () => {
      const { container } = render(<MagnifierIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('fill-primary', 'w-12');
    });
  });
});
