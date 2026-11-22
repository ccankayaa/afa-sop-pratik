"use client";

import { useEffect } from "react";
import { mountPractice } from "../lib/practice-runtime";

function Icon({ name, className = "icon" }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar" id="sidebar" aria-label="Study navigation">
      <a className="brand" href="/" aria-label="AFA SOP Practice">
        <span className="brand-mark">
          <Icon name="plane" />
        </span>
        <span className="brand-copy">
          <strong>
            SOP<span>PRACTICE</span>
          </strong>
          <small>DIAMOND DA20-C1</small>
        </span>
      </a>
      <button
        className="icon-button drawer-close"
        id="close-menu"
        type="button"
      />
      <nav className="sidebar-nav" id="sidebar-nav" />
      <div className="sidebar-bottom">
        <div className="academy-logo">
          <img
            src="/assets/afa-logo.png"
            alt="AFA — Atlantic Flight Academy"
            width="500"
            height="342"
          />
        </div>
        <p id="disclaimer" />
        <p id="privacy-note" />
        <button
          className="text-button storage-settings"
          data-action="storage-settings"
          id="storage-settings"
          type="button"
        />
        <a
          className="developer"
          href="https://github.com/ccankayaa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="brand-github" />
          <span id="developer-label" />
          <Icon name="external-link" className="icon external" />
        </a>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="topbar">
      <div className="topbar-start">
        <button
          className="icon-button"
          id="menu-toggle"
          type="button"
          aria-controls="sidebar"
          aria-expanded="true"
        />
        <span className="breadcrumb">
          <span className="breadcrumb-brand">SOP Practice</span>
          <span className="breadcrumb-divider">/</span>
          <span id="page-label" />
        </span>
      </div>
      <div className="topbar-actions">
        <span className="local-status" id="local-status" />
        <button
          className="button button-outline button-small search-open"
          id="search-open"
          type="button"
          aria-haspopup="dialog"
        />
        <button className="icon-button" id="theme-toggle" type="button" />
        <div className="language-switch" role="group" id="language-switch">
          <button type="button" data-language="tr" lang="tr">
            TR
          </button>
          <button type="button" data-language="en" lang="en">
            EN
          </button>
        </div>
      </div>
    </header>
  );
}

function Dialogs() {
  return (
    <>
      <dialog id="search-dialog" aria-labelledby="search-title">
        <div className="search-content">
          <div className="search-heading">
            <h2 id="search-title" />
            <button className="icon-button" id="search-close" type="button" />
          </div>
          <input id="search-input" type="search" autoComplete="off" />
          <p id="search-status" role="status" />
          <div id="search-results" />
        </div>
      </dialog>
      <dialog
        id="confirmation"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-text"
      >
        <form method="dialog" className="dialog-content">
          <span className="dialog-icon" id="dialog-icon" />
          <h2 id="confirmation-title" />
          <p id="confirmation-text" />
          <div className="dialog-actions">
            <button
              className="button button-outline"
              id="cancel-finish"
              value="cancel"
            />
            <button
              className="button button-primary"
              id="confirm-finish"
              value="finish"
            />
          </div>
        </form>
      </dialog>
    </>
  );
}

export default function PracticeShell() {
  useEffect(mountPractice, []);

  return (
    <>
      <a className="skip-link" href="#main" id="skip-link">
        Skip to content
      </a>
      <Sidebar />
      <button className="scrim" id="scrim" type="button" tabIndex={-1} hidden />
      <div className="shell" id="shell">
        <Header />
        <main id="main" tabIndex={-1}>
          <h1>AFA SOP Practice</h1>
          <p>Diamond DA20-C1 question bank</p>
          <noscript>Enable JavaScript to practice.</noscript>
        </main>
      </div>
      <Dialogs />
      <section
        id="storage-banner"
        className="storage-banner"
        aria-labelledby="storage-title"
        hidden
      />
      <div
        className="sr-only"
        id="announcer"
        aria-live="polite"
        aria-atomic="true"
      />
    </>
  );
}
