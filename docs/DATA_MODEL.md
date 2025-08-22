# Data Model (SQLAlchemy)

- __User__ (`users`)
  - id (str, PK)
  - email (str, unique)
  - first_name, last_name, phone
  - user_role (str) [ND_ADULT, EMPLOYER, MENTOR, GUARDIAN, ADMIN, MANAGER]
  - Employer fields: company_name, job_title, company_size, industry, company_website, contact_person, contact_person_designation, company_email, company_verification_docs, is_dei_compliant, dei_compliance_provider
  - ND fields: date_of_birth, guardian_email, accommodation_needs, relationship, nd_adult_email
  - Identity & Medical: identity_verification_doc, has_neuro_condition_recognized, recognized_neuro_condition, nd_condition_proof_docs, medical_conditions
  - Work prefs: location, preferred_work_environment, preferred_work_setup, availability_status, notes
  - Consents: public_profile_consent, privacy_agreed
  - created_at, updated_at, is_active

  - Guardian notes:
    - `nd_adult_email` is used by Guardians as "ND Mind Email" to link to the ND adult account.
    - `identity_verification_doc` is a single filename string reused to store either ND adult or Guardian verification document.

- __JobPosting__ (`job_postings`)
  - job_id (str, PK)
  - employer_id (FK -> users.id)
  - job_title, job_description, employment_type, location, work_setup
  - salary_range_min/max, requirements, benefits, posted_date, application_deadline, is_active

- __Trait__ (`traits`)
  - trait_id (str, PK), trait_name (unique), trait_description

- __Strength__ (`strengths`)
  - strength_id (str, PK), strength_name (unique), strength_description

- __IndividualTrait__ (`individual_traits`)
  - individual_trait_id (str, PK)
  - nd_adult_id (FK users.id), trait_id (FK traits.trait_id), notes

- __IndividualStrength__ (`individual_strengths`)
  - individual_strength_id (str, PK)
  - nd_adult_id (FK users.id), strength_id (FK strengths.strength_id), notes

- __JobMatch__ (`job_matches`)
  - match_id (str, PK)
  - nd_adult_id (FK users.id), job_id (FK job_postings.job_id)
  - match_score, match_reasoning, match_date
  - is_recommended_to_adult, is_viewed_by_adult, is_liked_by_adult, is_liked_by_employer

- __Assessment__ (`assessments`)
  - assessment_id (str, PK)
  - user_id (FK users.id)
  - assessment_type, title, description, questions (JSON), scoring_config (JSON), cdc_mapping (JSON), is_active
  - created_at, updated_at
  - Templates (quiz-templates) include: `work_env_matchmaker`, `micro_briefing_comprehension`, `sensory_profile_tolerance`, plus additional explorers (focus, pattern, communication, creative, processing)

- __AssessmentResponse__ (`assessment_responses`)
  - response_id (str, PK)
  - assessment_id (FK assessments.assessment_id), user_id (FK users.id)
  - responses (JSON), completion_time_seconds, completed_at

- __CognitiveProfile__ (`cognitive_profiles`)
  - profile_id (str, PK), user_id (FK users.id, unique)
  - strengths (floats): focus_sustained_attention, pattern_recognition, verbal_communication, spatial_reasoning, creative_ideation, multitasking_context_switching, processing_speed, executive_function, fine_motor_input, sensory_processing, communication_interpretation, attention_filtering
  - sensitivities (JSON), preferences (JSON)
  - embedding_vector (str), evidence_sources (JSON), confidence_score (float), last_updated

- __AuditLog__ (`audit_logs`)
  - audit_id (str, PK), user_id (FK users.id)
  - table_name, operation, old_values (JSON), new_values (JSON), timestamp
