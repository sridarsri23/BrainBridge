import streamlit as st
import pandas as pd
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="BrainBridge | Neurodiversity in Tech",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for styling
st.markdown("""
<style>
    .main-header {
        text-align: center;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 4rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
    
    .section-header {
        color: #3b82f6;
        font-size: 2.5rem;
        font-weight: bold;
        margin: 2rem 0 1rem 0;
        text-align: center;
    }
    
    .team-card {
        background: linear-gradient(135deg, #1f2937, #374151);
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid #4b5563;
        margin: 1rem 0;
        text-align: center;
    }
    
    .feature-card {
        background: linear-gradient(135deg, #1e293b, #334155);
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid #475569;
        margin: 1rem 0;
    }
    
    .metric-card {
        background: linear-gradient(135deg, #0f172a, #1e293b);
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid #334155;
        text-align: center;
    }
    
    .roadmap-phase {
        background: linear-gradient(135deg, #1e1b4b, #312e81);
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid #4c1d95;
        margin: 1rem 0;
    }
    
    .stButton > button {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

# Navigation sidebar
st.sidebar.title("🧠 BrainBridge Navigation")
sections = [
    "🏠 Home",
    "❗ The Problem", 
    "⚡ The Solution",
    "📊 Market Landscape",
    "💰 Revenue Streams",
    "🗺️ Roadmap"
]

selected_section = st.sidebar.radio("Navigate to:", sections)

# Hero Section
if selected_section == "🏠 Home":
    st.markdown('<h1 class="main-header">BrainBridge</h1>', unsafe_allow_html=True)
    st.markdown(
        '<p style="text-align: center; font-size: 1.5rem; color: #9ca3af; margin-bottom: 3rem;">Where Unique Minds Meet Inclusive Opportunities, Employers Find Their Unicorns</p>',
        unsafe_allow_html=True
    )
    
    st.markdown('<h2 class="section-header">Our Team</h2>', unsafe_allow_html=True)
    
    team_members = [
        {"name": "Sridar", "role": "Full Stack Developer, QA, Product Manager", "description": "Leading the technical vision and product strategy"},
        {"name": "Monika", "role": "Full Stack AI Engineer", "description": "Developing AI-driven matching algorithms"},
        {"name": "Zaidi", "role": "Back-end AI Engineer", "description": "Building scalable backend services"},
        {"name": "Noor", "role": "Front-end AI Engineer", "description": "Creating intuitive user interfaces"},
        {"name": "Bilal", "role": "Front-end Developer", "description": "Implementing responsive designs"}
    ]
    
    cols = st.columns(5)
    for i, member in enumerate(team_members):
        with cols[i]:
            st.markdown(f"""
            <div class="team-card">
                <div style="width: 80px; height: 80px; margin: 0 auto 1rem auto; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; color: white;">
                    {member['name'][0]}
                </div>
                <h3 style="color: white; margin-bottom: 0.5rem;">{member['name']}</h3>
                <p style="color: #3b82f6; font-size: 0.9rem; margin-bottom: 0.5rem;">{member['role']}</p>
                <p style="color: #9ca3af; font-size: 0.8rem;">{member['description']}</p>
            </div>
            """, unsafe_allow_html=True)

# Problem Section
elif selected_section == "❗ The Problem":
    st.markdown('<h1 class="section-header">Untapped Neurodivergent Potential</h1>', unsafe_allow_html=True)
    st.markdown(
        '<p style="text-align: center; font-size: 1.2rem; color: #9ca3af; margin-bottom: 3rem;">While rare skill demands are rising, more than 0.75 Billion high skill neuro divergents are job less</p>',
        unsafe_allow_html=True
    )
    
    problems = [
        "The Paradox: Solutions only reach a few. The vast majority of neurodivergent talent is left behind.",
        "The Skills Gap: Demand for focused jobs is rising, yet 75% of neurodivergent people are unemployed globally.",
        "The Waste: Late diagnosis leads to wasted time, stress, and misaligned careers.",
        "The Barrier: Companies want DEI, but high costs and poor guidance from consultants make it hard to achieve."
    ]
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### Key Challenges")
        for i, problem in enumerate(problems):
            st.markdown(f"""
            <div class="feature-card">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                    <div style="width: 2rem; height: 2rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; flex-shrink: 0;">
                        {i + 1}
                    </div>
                    <p style="color: #e5e7eb; margin: 0;">{problem}</p>
                </div>
            </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("### Core Problem")
        st.markdown("""
        <div class="feature-card">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">💡</div>
                <h3 style="color: white; margin-bottom: 1rem;">The Real Challenge</h3>
            </div>
            <div style="text-align: left;">
                <p style="color: #e5e7eb; margin-bottom: 1rem;">
                    <strong style="color: #3b82f6;">1. Complications on ND Strengths-JD Matching:</strong>
                    It's not enough to just know the theory behind matching neurodivergent strengths to job roles.
                </p>
                <p style="color: #e5e7eb; margin: 0;">
                    <strong style="color: #3b82f6;">2. A Deeper Gap, not diving deep:</strong>
                    The real challenge lies in accurately evaluating an individual's unique neurodivergent profile and precisely interpreting a job description to ensure a confident and accurate match.
                </p>
            </div>
        </div>
        """, unsafe_allow_html=True)

# Features Section
elif selected_section == "⚡ The Solution":
    st.markdown('<h1 class="section-header">Comprehensive Features</h1>', unsafe_allow_html=True)
    st.markdown(
        '<p style="text-align: center; font-size: 1.2rem; color: #9ca3af; margin-bottom: 3rem;">BrainBridge empowers neurodiverse talent and inclusive employers through intelligent tools.</p>',
        unsafe_allow_html=True
    )
    
    features = [
        {
            "title": "Self-Discovery Engine",
            "icon": "🧠",
            "description": "Interactive tool that helps neurodiverse talent uncover cognitive strengths and work preferences.",
            "benefits": [
                "Gamified quizzes and cognitive pattern tests",
                "Generates a personalized Neuro Work Profile", 
                "Guides learners towards tailored training and jobs"
            ]
        },
        {
            "title": "JD Normalizer",
            "icon": "📄",
            "description": "AI-powered engine that rewrites job descriptions to be more neuro-inclusive and accessible.",
            "benefits": [
                "Detects exclusionary or biased wording in job posts",
                "Suggests inclusive alternatives automatically",
                "Improves accessibility for neurodiverse applicants"
            ]
        },
        {
            "title": "Job Matching Engine", 
            "icon": "⚡",
            "description": "AI-driven matching system that aligns cognitive strengths of ND talent with role requirements.",
            "benefits": [
                "Analyzes role tasks and cognitive fit profiles",
                "Recommends best-matched ND candidates",
                "Continuously learns from hiring outcomes"
            ]
        }
    ]
    
    cols = st.columns(3)
    for i, feature in enumerate(features):
        with cols[i]:
            st.markdown(f"""
            <div class="feature-card">
                <div style="text-align: center; margin-bottom: 1rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">{feature['icon']}</div>
                    <h3 style="color: white; margin-bottom: 0.5rem;">{feature['title']}</h3>
                    <p style="color: #9ca3af; margin-bottom: 1.5rem;">{feature['description']}</p>
                </div>
                <div>
                    <h4 style="color: #6b7280; font-size: 0.9rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">Benefits</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
            """, unsafe_allow_html=True)
            
            for benefit in feature['benefits']:
                st.markdown(f"""
                        <li style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <span style="color: #10b981; font-size: 0.8rem; margin-top: 0.1rem;">✓</span>
                            <span style="color: #e5e7eb; font-size: 0.9rem;">{benefit}</span>
                        </li>
                """, unsafe_allow_html=True)
            
            st.markdown("""
                    </ul>
                </div>
            </div>
            """, unsafe_allow_html=True)

# Market Section
elif selected_section == "📊 Market Landscape":
    st.markdown('<h1 class="section-header">Competitive Landscape</h1>', unsafe_allow_html=True)
    st.markdown(
        '<p style="text-align: center; font-size: 1.2rem; color: #9ca3af; margin-bottom: 3rem;">While there are platforms addressing employment for neurodiverse individuals or corporate DEI training, none integrate talent discovery, adaptive learning, employer certification, and AI-driven job matching in one ecosystem like BrainBridge does with AI</p>',
        unsafe_allow_html=True
    )
    
    # Competitors
    st.markdown("### Competitive Analysis")
    competitors = [
        {"name": "Mentra", "description": "AI platform matching ND professionals to Fortune; profiles go beyond resumes.", "differentiation": "BrainBridge adds self-discovery, JD normalization, and employer certification to create a closed loop - not just matching"},
        {"name": "Specialisterne", "description": "Focuses on placing autistic talent in roles, but limited adaptive learning or AI-driven matching.", "differentiation": "BrainBridge pairs AI task-matching with self-discovery profiles and certifies employers for long-term fit."},
        {"name": "Untapped.ai", "description": "Provides neurodiversity coaching for organizations, but doesn't cover end-to-end hiring pipelines or candidate self-discovery.", "differentiation": "BrainBridge delivers an end-to-end pipeline: discovery → JD parser → AI cognitive-fit matching → certified employers."}
    ]
    
    cols = st.columns(3)
    for i, comp in enumerate(competitors):
        with cols[i]:
            st.markdown(f"""
            <div class="feature-card">
                <h3 style="color: white; margin-bottom: 1rem;">{comp['name']}</h3>
                <p style="color: #9ca3af; margin-bottom: 1rem; font-size: 0.9rem;">{comp['description']}</p>
                <p style="color: #3b82f6; font-size: 0.8rem;">
                    <strong>Differentiation:</strong> {comp['differentiation']}
                </p>
            </div>
            """, unsafe_allow_html=True)
    
    # Market Sizing
    st.markdown("### Market Sizing")
    market_data = [
        {
            "title": "Total Addressable Market (TAM)",
            "value": "$50B+",
            "description": "Global EdTech + HRTech intersection targeting neurodiversity inclusion"
        },
        {
            "title": "Serviceable Available Market (SAM)", 
            "value": "$5B",
            "description": "ND-focused job placement, LMS, employer DEI services in North America + Europe"
        },
        {
            "title": "Serviceable Obtainable Market (SOM)",
            "value": "$10-20M",
            "description": "Year 1-2 potential revenue with 10k ND adults + 500 employers"
        }
    ]
    
    cols = st.columns(3)
    for i, market in enumerate(market_data):
        with cols[i]:
            st.markdown(f"""
            <div class="metric-card">
                <h3 style="color: #3b82f6; margin-bottom: 0.5rem;">{market['title']}</h3>
                <div style="font-size: 2.5rem; font-weight: bold; color: white; margin-bottom: 1rem;">{market['value']}</div>
                <p style="color: #9ca3af; font-size: 0.9rem;">{market['description']}</p>
            </div>
            """, unsafe_allow_html=True)

# Revenue Section
elif selected_section == "💰 Revenue Streams":
    st.markdown('<h1 class="section-header">Revenue Streams</h1>', unsafe_allow_html=True)
    st.markdown(
        '<p style="text-align: center; font-size: 1.2rem; color: #9ca3af; margin-bottom: 3rem;">Multiple monetization channels to ensure sustainable growth and impact</p>',
        unsafe_allow_html=True
    )
    
    revenue_streams = [
        {
            "title": "Talent Portal Monetization",
            "items": ["Premium microlearning access", "AI Task Coach", "Mentorship Match", "Corporate sponsorship (e.g., SAP sponsors 500 learners)", "Government/NGO grants"]
        },
        {
            "title": "AI Mentor Support", 
            "items": ["Premium AI mentor features", "Personalized career coaching", "Interview preparation modules", "Skill development tracking"]
        },
        {
            "title": "Corporate Certification Program",
            "items": ["DEI certification for employers", "Neurodiversity inclusion training", "Workplace accommodation guidance", "Ongoing support and resources"]
        },
        {
            "title": "Job Funnel + ATS Plugin",
            "items": ["Tailored job board", "Resume ranking for neurodiverse applicants", "Pattern-matching algorithm", "Integration with existing ATS systems"]
        },
        {
            "title": "Government Subsidy Gateway",
            "items": ["Automated documentation", "EU/US workforce grant applications", "Compliance tracking", "Subsidy optimization"]
        },
        {
            "title": "Multi-Domain Applicability",
            "items": ["Expansion to different industries", "Custom solutions for various neurotypes", "Scalable platform for global reach", "Partnership opportunities"]
        }
    ]
    
    cols = st.columns(2)
    for i, stream in enumerate(revenue_streams):
        with cols[i % 2]:
            st.markdown(f"""
            <div class="feature-card">
                <h3 style="color: white; margin-bottom: 1rem;">{stream['title']}</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
            """, unsafe_allow_html=True)
            
            for item in stream['items']:
                st.markdown(f"""
                    <li style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="color: #3b82f6; margin-top: 0.1rem;">•</span>
                        <span style="color: #e5e7eb; font-size: 0.9rem;">{item}</span>
                    </li>
                """, unsafe_allow_html=True)
            
            st.markdown("</ul></div>", unsafe_allow_html=True)

# Roadmap Section
elif selected_section == "🗺️ Roadmap":
    st.markdown('<h1 class="section-header">Our Roadmap</h1>', unsafe_allow_html=True)
    st.markdown(
        '<p style="text-align: center; font-size: 1.2rem; color: #9ca3af; margin-bottom: 3rem;">Strategic development phases to ensure impactful and sustainable growth</p>',
        unsafe_allow_html=True
    )
    
    roadmap_phases = [
        {
            "phase": "Phase 1",
            "title": "Foundation & MVP",
            "items": ["Agentize Mentor Role", "Basic employer evaluation framework", "Core LMS functionality", "Initial self-assessment modules", "Basic matching algorithm"]
        },
        {
            "phase": "Phase 2", 
            "title": "Enhancement",
            "items": ["Employer Certification Program", "ND-LMS skill modules", "Dynamic self-assessments", "Algorithm refinement with real-world data", "Content library expansion", "UI Enhancements/Fixes", "Add email verification during signup", "Place proper privacy agreements", "Display notifications based progress (%) in profile dashboard area to complete profile"]
        },
        {
            "phase": "Phase 3",
            "title": "Expansion", 
            "items": ["Full certification platform", "Comprehensive employer portal", "Advanced analytics", "Multi-language support", "Global partnership program", "Implement MFA", "Guardian ↔ ND-Mind Control"]
        },
        {
            "phase": "Phase 4",
            "title": "Maturity",
            "items": ["Industry-specific solutions", "Government integration", "Research partnerships", "Global scale operations", "Continuous improvement cycle"]
        }
    ]
    
    for i, phase in enumerate(roadmap_phases):
        st.markdown(f"""
        <div class="roadmap-phase">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <div style="width: 3rem; height: 3rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem; margin-right: 1rem;">
                    {i + 1}
                </div>
                <div>
                    <div style="color: #3b82f6; font-weight: bold; font-size: 0.9rem;">{phase['phase']}</div>
                    <h3 style="color: white; margin: 0; font-size: 1.5rem;">{phase['title']}</h3>
                </div>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0;">
        """, unsafe_allow_html=True)
        
        for item in phase['items']:
            st.markdown(f"""
                <li style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span style="color: #3b82f6; margin-top: 0.1rem;">•</span>
                    <span style="color: #e5e7eb; font-size: 0.9rem;">{item}</span>
                </li>
            """, unsafe_allow_html=True)
        
        st.markdown("</ul></div>", unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown(
    '<p style="text-align: center; color: #6b7280; font-size: 0.9rem;">BrainBridge - Empowering Neurodiverse Talent and Inclusive Workplaces</p>',
    unsafe_allow_html=True
)
